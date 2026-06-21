import * as THREE from 'three';

export default function getFresnel({ rimHex = 0x0088ff, facingHex = 0x000000 } = {}) {
    const uniforms = {
        color1: { value: new THREE.Color(rimHex) },
        color2: { value: new THREE.Color(facingHex) },
    };
    const mat = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vViewDir;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vec4 viewPos = modelViewMatrix * vec4(position, 1.0);
                vViewDir = normalize(-viewPos.xyz);
                gl_Position = projectionMatrix * viewPos;
            }
        `,
        fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;
            varying vec3 vNormal;
            varying vec3 vViewDir;
            void main() {
                float fresnel = pow(1.0 - dot(vNormal, vViewDir), 7.0);
                gl_FragColor = vec4(mix(color2, color1, fresnel), fresnel);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.FrontSide,
    });

    const geo = new THREE.IcosahedronGeometry(1.01, 12);
    return new THREE.Mesh(geo, mat);
}
