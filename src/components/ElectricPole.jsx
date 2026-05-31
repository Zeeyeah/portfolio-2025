/**
 * ElectricPole.jsx
 *
 * Physics-based electric pole with 4 rows of sagging power lines.
 * Wire STARTS are pinned to the pole via useFixedJoint so they truly
 * follow it when dragged.
 *
 * Dependencies:
 *   @react-three/fiber @react-three/drei @react-three/rapier three meshline
 *
 * Texture: /public/electric.png
 * Usage: <ElectricPoleScene />
 */

import { Center, Environment, OrbitControls, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useFixedJoint,
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

// ─── Config ───────────────────────────────────────────────────────────────────

const POLE_W = 4.2;
const POLE_H = 4.0;
const SEGMENTS = 6;   // physics bodies per wire half
const SEG_LEN  = 0.95; // rope joint max distance

// Wire row local-Y offsets on the pole (in pole-local space)
const WIRE_ROWS = [
    { y: -0.4 },
    { y:  -0.7 },
    { y: -1.3 },
    { y:  -1.5 },
];

// Where the far fixed anchors live in world space
const ANCHOR_X = 4.0;
const ANCHOR_Z = 5.5;
const ANCHOR_Y_BASE = 2; // world Y of top row anchor

const WIRE_COLORS = ["#000000", "#000000", "#000000", "#000000"];

const bodyProps = {
  canSleep: false,
  colliders: false,
  angularDamping: 20,
  linearDamping: 4,
};

// ─── Identity quaternion (used by useFixedJoint) ──────────────────────────────
const Q_ID = [0, 0, 0, 1];

// ─── PinToBody ────────────────────────────────────────────────────────────────
/**
 * Pins `childRef` to `parentRef` at local offset `offset` on parent.
 * childRef starts at exactly that world position so no snap occurs.
 */
function PinToBody({ parentRef, childRef, offset }) {
  // anchor on parent = local offset, anchor on child = [0,0,0]
  useFixedJoint(parentRef, childRef, [offset, Q_ID, [0, 0, 0], Q_ID]);
  return null;
}

// ─── PhysicsWire ─────────────────────────────────────────────────────────────
/**
 * Chain of dynamic bodies between startRef (pinned to pole) and endRef (fixed).
 * Renders a visible MeshLine through all body positions each frame.
 */
function PhysicsWire({ startRef, endRef, startPos, endPos, color }) {
  // Intermediate segment refs
  const segRefs = useRef(
    Array.from({ length: SEGMENTS }, () => createRef())
  );

  // Initial positions: straight line with catenary sag
  const initPositions = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= SEGMENTS + 1; i++) {
      const t = i / (SEGMENTS + 1);
      const x = startPos[0] + (endPos[0] - startPos[0]) * t;
      const z = startPos[2] + (endPos[2] - startPos[2]) * t;
      const sag = Math.sin(Math.PI * t) * -1.5;
      const y = startPos[1] + (endPos[1] - startPos[1]) * t + sag;
      pts.push([x, y, z]);
    }
    return pts;
  }, []); // eslint-disable-line

  // Rope joints: startRef → seg[0] → … → seg[N-1] → endRef
  const allRefs = [startRef, ...segRefs.current, endRef];
  for (let i = 0; i < allRefs.length - 1; i++) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useRopeJoint(allRefs[i], allRefs[i + 1], [[0, 0, 0], [0, 0, 0], SEG_LEN]);
  }

  // MeshLine visual
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

  const meshRef = useRef();

  useFrame(() => {
    const flat = [];
    for (const r of allRefs) {
      if (r?.current) {
        const p = r.current.translation?.();
        if (p) flat.push(p.x, p.y, p.z);
      }
    }
    if (flat.length >= 6 && meshRef.current) {
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
          position={initPositions[i + 1]}
          {...bodyProps}
        >
          <BallCollider args={[0.05]} />
        </RigidBody>
      ))}
      <mesh ref={meshRef} geometry={lineGeo} material={lineMat} />
    </>
  );
}

// ─── WireRow ──────────────────────────────────────────────────────────────────
/**
 * One row of wires. Creates:
 *  - 2 small "anchor" RigidBodies that are pinned to the pole
 *  - 2 fixed far-anchor RigidBodies
 *  - 2 PhysicsWire chains connecting them
 */
function WireRow({ poleRef, rowY, poleStartPos, color, rowIndex }) {
  const rightAnchorRef = useRef();
  const leftAnchorRef  = useRef();
  const rightEndRef    = useRef();
  const leftEndRef     = useRef();

  // Local offset from pole center where this row's wire attaches
  const rightOffset = [ 0.02, rowY, 0];
  const leftOffset  = [-0.02, rowY, 0];

  // World start positions (pole starts at origin, so same as local initially)
  const rightStartPos = [poleStartPos[0] + 0.02, poleStartPos[1] + rowY, poleStartPos[2]];
  const leftStartPos  = [poleStartPos[0] - 0.02, poleStartPos[1] + rowY, poleStartPos[2]];

  // Far anchor world positions
  const anchorY = ANCHOR_Y_BASE - rowIndex * 0.5;
  const rightEndPos = [ ANCHOR_X, anchorY, ANCHOR_Z];
  const leftEndPos  = [-ANCHOR_X, anchorY, ANCHOR_Z];

  return (
    <>
      {/* Pin small anchor bodies to the pole */}
      <PinToBody parentRef={poleRef} childRef={rightAnchorRef} offset={rightOffset} />
      <PinToBody parentRef={poleRef} childRef={leftAnchorRef}  offset={leftOffset}  />

      {/* Pole-side anchor bodies (tiny, pinned) */}
      <RigidBody ref={rightAnchorRef} type="dynamic" position={rightStartPos} {...bodyProps}>
        <BallCollider args={[0.05]} />
      </RigidBody>
      <RigidBody ref={leftAnchorRef} type="dynamic" position={leftStartPos} {...bodyProps}>
        <BallCollider args={[0.05]} />
      </RigidBody>

      {/* Fixed far anchors */}
      <RigidBody ref={rightEndRef} type="fixed" position={rightEndPos}>
        <BallCollider args={[0.08]} />
      </RigidBody>
      <RigidBody ref={leftEndRef} type="fixed" position={leftEndPos}>
        <BallCollider args={[0.08]} />
      </RigidBody>

      {/* Physics wire chains */}
      <PhysicsWire
        startRef={rightAnchorRef}
        endRef={rightEndRef}
        startPos={rightStartPos}
        endPos={rightEndPos}
        color={color}
      />
      <PhysicsWire
        startRef={leftAnchorRef}
        endRef={leftEndRef}
        startPos={leftStartPos}
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

  // Pole starts at origin
  const POLE_START = [0, 0, 0];

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

  const onPointerDown = useCallback(
    (e) => {
      e.stopPropagation();
      gl.domElement.setPointerCapture(e.pointerId);
      const pos = poleRef.current?.translation();
      if (!pos) return;
      setDragged({
        x: e.point.x - pos.x,
        y: e.point.y - pos.y,
        z: e.point.z - pos.z,
      });
    },
    [gl]
  );

  const onPointerUp = useCallback(
    (e) => {
      gl.domElement.releasePointerCapture(e.pointerId);
      setDragged(null);
    },
    [gl]
  );

  return (
    <Center>
      {/* ── Pole body (mesh lives INSIDE so it moves with physics) ── */}
      <RigidBody
        ref={poleRef}
        type={dragged ? "kinematicPosition" : "dynamic"}
        position={POLE_START}
        {...bodyProps}
        angularDamping={5}
        linearDamping={5}
      >
        <CuboidCollider args={[POLE_W / 2, POLE_H / 2, 0]} />
        <mesh
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <planeGeometry args={[POLE_W, POLE_H]} />
          <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
        </mesh>
      </RigidBody>

      {/* ── Wire rows (each pins its anchors to poleRef via useFixedJoint) ── */}
      {WIRE_ROWS.map(({ y }, i) => (
        <WireRow
          key={i}
          poleRef={poleRef}
          rowY={y}
          poleStartPos={POLE_START}
          color={WIRE_COLORS[i]}
          rowIndex={i}
        />
      ))}

      {/* ── Ground ── */}
    </Center>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────

export function ElectricPoleScene() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);

    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);
    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        shadows
        camera={{ position: [0, 1, isMobile ? 17 : 8], fov: 48 }}
        style={{ touchAction: "none" }}
      >

        <Physics gravity={[0, -9.81, 0]} timeStep={1 / 60}>
          <ElectricPole />
        </Physics>
      </Canvas>
    </div>
  );
}

export default ElectricPoleScene;