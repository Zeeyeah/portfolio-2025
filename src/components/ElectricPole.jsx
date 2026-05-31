import { Center, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
} from "@react-three/rapier";
import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

// ─── Config (your values, unchanged) ─────────────────────────────────────────

const POLE_W = 4.2;
const POLE_H = 4.0;
const SEGMENTS = 6;
const SEG_LEN  = 0.95;

const WIRE_ROWS = [
  { y: -0.4  },
  { y: -0.7  },
  { y: -1.3  },
  { y: -1.5  },
];

const ANCHOR_X      = 4.0;
const ANCHOR_Z      = 5.5;
const ANCHOR_Y_BASE = 2;

const WIRE_COLORS = ["#000000", "#000000", "#000000", "#000000"];

const SEG_PROPS = {
  canSleep: false,
  colliders: false,
  angularDamping: 20,
  linearDamping: 4,
};

// ─── PhysicsWire ──────────────────────────────────────────────────────────────
// The pole RigidBody IS the first link — no separate anchor body, no useFixedJoint.
// poleAnchorLocal = attachment point in pole-local space.
// Joint chain: poleRef[poleAnchorLocal] → seg[0] → … → seg[N-1] → endRef

function PhysicsWire({ poleRef, poleAnchorLocal, endRef, startWorldPos, endPos, color }) {
  const segRefs = useRef(Array.from({ length: SEGMENTS }, () => createRef()));

  // Catenary spawn positions for segments
  const initPositions = useMemo(() => {
    const pts = [];
    for (let i = 0; i < SEGMENTS; i++) {
      const t = (i + 1) / (SEGMENTS + 1);
      const x = startWorldPos[0] + (endPos[0] - startWorldPos[0]) * t;
      const z = startWorldPos[2] + (endPos[2] - startWorldPos[2]) * t;
      const sag = Math.sin(Math.PI * t) * -1.5;
      const y = startWorldPos[1] + (endPos[1] - startWorldPos[1]) * t + sag;
      pts.push([x, y, z]);
    }
    return pts;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // pole → seg[0], using local offset on the pole body
  useRopeJoint(poleRef, segRefs.current[0], [poleAnchorLocal, [0, 0, 0], SEG_LEN]);

  // seg[i] → seg[i+1]
  for (let i = 0; i < SEGMENTS - 1; i++) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useRopeJoint(segRefs.current[i], segRefs.current[i + 1], [[0, 0, 0], [0, 0, 0], SEG_LEN]);
  }

  // seg[last] → fixed end anchor
  useRopeJoint(segRefs.current[SEGMENTS - 1], endRef, [[0, 0, 0], [0, 0, 0], SEG_LEN]);

  // MeshLine
  const lineGeo = useMemo(() => new MeshLineGeometry(), []);
  const lineMat = useMemo(
    () =>
      new MeshLineMaterial({
        color: new THREE.Color(color),
        lineWidth: 0.009,
        resolution: new THREE.Vector2(
          typeof window !== "undefined" ? window.innerWidth : 1920,
          typeof window !== "undefined" ? window.innerHeight : 1080
        ),
      }),
    [color]
  );

  const meshRef   = useRef();
  const _v        = useMemo(() => new THREE.Vector3(), []);
  const _q        = useMemo(() => new THREE.Quaternion(), []);
  const _offset   = useMemo(() => new THREE.Vector3(), []);
  const _polePos  = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!meshRef.current) return;
    const flat = [];

    // First point: pole world position + local offset rotated by pole quaternion
    if (poleRef.current) {
      const pt  = poleRef.current.translation();
      const rot = poleRef.current.rotation();
      _q.set(rot.x, rot.y, rot.z, rot.w);
      _polePos.set(pt.x, pt.y, pt.z);
      _offset.set(...poleAnchorLocal).applyQuaternion(_q).add(_polePos);
      flat.push(_offset.x, _offset.y, _offset.z);
    }

    // Intermediate segments
    for (const r of segRefs.current) {
      const p = r?.current?.translation?.();
      if (p) flat.push(p.x, p.y, p.z);
    }

    // End anchor
    const ep = endRef?.current?.translation?.();
    if (ep) flat.push(ep.x, ep.y, ep.z);

    if (flat.length >= 6) {
      lineGeo.setPoints(flat);
      meshRef.current.geometry = lineGeo;
    }
  });

  return (
    <>
      {segRefs.current.map((ref, i) => (
        <RigidBody
          key={i}
          ref={ref}
          type="dynamic"
          position={initPositions[i]}
          {...SEG_PROPS}
          additionalSolverIterations={4}
        >
          <BallCollider args={[0.05]} mass={0.05} />
        </RigidBody>
      ))}
      <mesh ref={meshRef} geometry={lineGeo} material={lineMat} />
    </>
  );
}

// ─── WireRow ──────────────────────────────────────────────────────────────────

function WireRow({ poleRef, rowY, color, rowIndex }) {
  const rightEndRef = useRef();
  const leftEndRef  = useRef();

  // Local offsets on the pole (your original 0.02 spread)
  const rightLocal = [ 0.02, rowY, 0];
  const leftLocal  = [-0.02, rowY, 0];

  // World start positions (pole spawns at origin)
  const rightStartWorld = [ 0.02, rowY, 0];
  const leftStartWorld  = [-0.02, rowY, 0];

  const anchorY     = ANCHOR_Y_BASE - rowIndex * 0.5;
  const rightEndPos = [ ANCHOR_X, anchorY, ANCHOR_Z];
  const leftEndPos  = [-ANCHOR_X, anchorY, ANCHOR_Z];

  return (
    <>
      <RigidBody ref={rightEndRef} type="fixed" position={rightEndPos} colliders={false}>
        <BallCollider args={[0.08]} />
      </RigidBody>
      <RigidBody ref={leftEndRef} type="fixed" position={leftEndPos} colliders={false}>
        <BallCollider args={[0.08]} />
      </RigidBody>

      <PhysicsWire
        poleRef={poleRef}
        poleAnchorLocal={rightLocal}
        endRef={rightEndRef}
        startWorldPos={rightStartWorld}
        endPos={rightEndPos}
        color={color}
      />
      <PhysicsWire
        poleRef={poleRef}
        poleAnchorLocal={leftLocal}
        endRef={leftEndRef}
        startWorldPos={leftStartWorld}
        endPos={leftEndPos}
        color={color}
      />
    </>
  );
}

// ─── ElectricPole ─────────────────────────────────────────────────────────────

function ElectricPole() {
  const texture = useTexture("/electric.png");
  const poleRef = useRef();
  const [dragged, setDragged] = useState(null);
  const { gl } = useThree();

  const vec = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    if (!dragged || !poleRef.current) return;
    vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
    dir.copy(vec).sub(state.camera.position).normalize();
    vec.add(dir.multiplyScalar(state.camera.position.length()));
    poleRef.current.setNextKinematicTranslation({
      x: vec.x - dragged.x,
      y: vec.y - dragged.y,
      z: vec.z - dragged.z,
    });
  });

  const onPointerDown = useCallback((e) => {
    e.stopPropagation();
    gl.domElement.setPointerCapture(e.pointerId);
    const pos = poleRef.current?.translation();
    if (!pos) return;
    setDragged({ x: e.point.x - pos.x, y: e.point.y - pos.y, z: e.point.z - pos.z });
  }, [gl]);

  const onPointerUp = useCallback((e) => {
    gl.domElement.releasePointerCapture(e.pointerId);
    setDragged(null);
  }, [gl]);

  return (
    <Center>
      <RigidBody
        ref={poleRef}
        type={dragged ? "kinematicPosition" : "fixed"}
        position={[0, 0, 0]}
        canSleep={false}
        colliders={false}
        angularDamping={5}
        linearDamping={5}
      >
        <CuboidCollider args={[POLE_W / 2, POLE_H / 2, 0.05]} />
        <mesh
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <planeGeometry args={[POLE_W, POLE_H]} />
          <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
        </mesh>
      </RigidBody>

      {WIRE_ROWS.map(({ y }, i) => (
        <WireRow
          key={i}
          poleRef={poleRef}
          rowY={y}
          color={WIRE_COLORS[i]}
          rowIndex={i}
        />
      ))}
    </Center>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────

export function ElectricPoleScene() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        shadows
        camera={{ position: [0, 1, isMobile ? 17 : 8], fov: 48 }}
        style={{ touchAction: "none" }}
      >
        <Physics
          gravity={[0, -9.81, 0]}
          timeStep={1 / 60}
          numSolverIterations={12}
          numAdditionalFrictionIterations={4}
          numInternalPgsIterations={1}
        >
          <ElectricPole />
        </Physics>
      </Canvas>
    </div>
  );
}

export default ElectricPoleScene;