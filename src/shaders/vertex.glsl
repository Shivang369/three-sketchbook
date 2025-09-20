uniform vec2 uFrequency;
uniform vec2 uAmplitude;
uniform float uTime;

varying float vElevation;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    vElevation = sin(modelPosition.x * uFrequency.x - uTime) * uAmplitude.x;
    vElevation += sin(modelPosition.z * uFrequency.y - uTime) * uAmplitude.y;

    modelPosition.y += vElevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    float bound = max(uAmplitude.x, uAmplitude.y);
    // remap elevation to [0, 1] range
    vElevation = (vElevation + bound) / (2.0 * bound);
}