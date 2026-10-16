/* mesh.js — THE mesh gradient. One copy, two consumers.

   The hero gradient on index.html and the gradient export tool
   (kinetic-creative-studio/clients/pave/designs/04-Gradient.html, which
   reaches this file through the `site-src` symlink) both run THIS shader.
   Teresa asked for a static version of the homepage gradient for Figma; a
   still that came out of a second copy of the shader would be a picture of
   something else the first time either copy was tuned. So the factory,
   the fragment shader, the defaults and the dial spec live here, and the
   export tool renders the homepage's own pixels.

   Lifted verbatim out of index.html's mesh IIFE on 2026-09-10 — same code,
   same defaults, same node order. The page keeps everything AROUND it (the
   instances, the resize maths, the mouse easing, the dials): those are the
   page's, not the component's.

   Consumers read it off the global:
     var PM = window.PaveMesh;
     var mesh = PM.createMesh(canvas, PM.defaultConfig());
     mesh.resize(w, h); mesh.draw(timeSeconds, mouseX, mouseY);

   A classic script, not a module: index.html's shader block is a classic
   IIFE, and a module would land after it. */
(function () {
// Node labels match the mesh rows in the fragment shader. Spelled out
// rather than 'Navy L': a dial's label is derived from its key by
// splitting camelCase, and a lone capital has nothing to split against,
// so 'Navy L weight' came back reading 'Navy LWeight'.
var NODE_NAMES = ['Navy left', 'Navy right', 'Royal left', 'Royal centre', 'Royal right',
                  'Azure left', 'Azure right', 'Ice left', 'Ice right', 'Base', 'Aqua'];

// Defaults — identical to the pre-refactor hardcoded shader, EXCEPT
// greenTrim 0.00 → 0.35: the deliberate pass shifting the palette away
// from aqua/green toward blue. Set it back to 0 for the original look.
function defaultConfig() {
  return {
    params: {
      darkness: 0.25, aqua: 0.00, saturation: 2.75, brightness: 1.72,
      hue: 0.07, greenTrim: 0.35,
      blur: 0.66, spread: 1.14, speed: 1.31, mouseStrength: 0.00, mouseRadius: 0.38
    },
    colors: [
      /* Navy L + Navy R — #04060c per Hunter */
      [0.016, 0.024, 0.047], [0.016, 0.024, 0.047],
      [0.055, 0.200, 0.720], [0.140, 0.360, 0.950], [0.040, 0.110, 0.420],
      [0.280, 0.550, 0.930], [0.450, 0.690, 0.950],
      [0.700, 0.800, 0.920], [0.810, 0.880, 0.950],
      [0.729, 0.729, 0.729],   /* Base — #bababa per Hunter */
      [0.350, 0.900, 0.800]
    ],
    // Azure L (index 5) baked to 0 per Hunter — restore via the panel
    weights: [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1]
  };
}

var SPEC = [
  ['darkness',      0,    0.9, 0.01, 'Darkness'],
  ['aqua',          0,    2,   0.01, 'Aqua tint'],
  ['saturation',    0,    3.5, 0.01, 'Saturation'],
  ['brightness',    0.3,  2.2, 0.01, 'Brightness'],
  ['hue',          -0.6,  0.6, 0.01, 'Hue shift'],
  ['greenTrim',     0,    1,   0.01, 'Green trim'],
  ['blur',          0.25, 3,   0.01, 'Mesh blur'],
  ['spread',        0.2,  2.5, 0.01, 'Mesh spread'],
  ['speed',         0,    5,   0.01, 'Drift speed'],
  ['mouseStrength', 0,    3,   0.01, 'Mouse pull'],
  ['mouseRadius',   0.03, 1.5, 0.01, 'Mouse radius']
];

var VS = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';

// True mesh gradient: 11 gaussian color nodes stacked dark(top)→light(bottom),
// blended by normalized weights. Node COLORS + WEIGHTS are uniforms so every
// instance can carry its own palette over the same motion.
var FS = [
  'precision highp float;',
  'uniform vec2 u_res;',
  'uniform float u_time;',
  'uniform vec2 u_mouse;',
  'uniform float u_dark;',
  'uniform float u_aqua;',
  'uniform float u_sat;',
  'uniform float u_bright;',
  'uniform float u_hue;',
  'uniform float u_gtrim;',
  'uniform float u_blur;',
  'uniform float u_spread;',
  'uniform float u_speed;',
  'uniform float u_mstr;',
  'uniform float u_mrad;',
  'uniform vec3 u_c0;uniform vec3 u_c1;uniform vec3 u_c2;uniform vec3 u_c3;',
  'uniform vec3 u_c4;uniform vec3 u_c5;uniform vec3 u_c6;uniform vec3 u_c7;',
  'uniform vec3 u_c8;uniform vec3 u_c9;uniform vec3 u_c10;',
  'uniform float u_w0;uniform float u_w1;uniform float u_w2;uniform float u_w3;',
  'uniform float u_w4;uniform float u_w5;uniform float u_w6;uniform float u_w7;',
  'uniform float u_w8;uniform float u_w9;uniform float u_w10;',
  'float hash21(vec2 p){',
  '  p = fract(p*vec2(123.34,456.21));',
  '  p += dot(p,p+45.32);',
  '  return fract(p.x*p.y);',
  '}',
  'float nw(vec2 p, vec2 c, float s){',
  '  vec2 d = p-c;',
  '  return exp(-dot(d,d)/(s*s));',
  '}',
  'void main(){',
  '  vec2 uv = gl_FragCoord.xy/u_res;',
  '  float aspect = u_res.x/u_res.y;',
  '  float tm = u_time*u_speed;',
  '  vec2 p = vec2(uv.x*aspect, uv.y);',
  '  vec2 m = vec2(u_mouse.x*aspect, u_mouse.y);',
  '  vec2 mdp = p-m;',
  '  float infl = exp(-dot(mdp,mdp)/(u_mrad*u_mrad));',
  '  p -= mdp*infl*u_mstr*0.10;',
  '  float cx = 0.5*aspect;',
  '  float sp = u_spread;',
  '  float sg = 0.42*u_blur;',
  '  vec3 cs = vec3(0.0);',
  '  float ws = 0.0;',
  '  float w = 0.0;',
  // top row — deep navy anchors keep nav + stat marquee legible
  '  w = nw(p, vec2(cx-0.55*sp, 1.00+0.03*sin(tm*0.50+1.0)), sg*1.35)*u_w0; cs += w*u_c0; ws += w;',
  '  w = nw(p, vec2(cx+0.50*sp+0.10*sin(tm*0.40), 0.98), sg*1.35)*u_w1; cs += w*u_c1; ws += w;',
  // upper-mid — royal blues
  '  w = nw(p, vec2(cx-0.75*sp+0.16*sin(tm*0.55+2.1), 0.70+0.06*cos(tm*0.42)), sg)*u_w2; cs += w*u_c2; ws += w;',
  '  w = nw(p, vec2(cx+0.15*sp+0.20*sin(tm*0.35+4.2), 0.64+0.05*sin(tm*0.60+0.7)), sg)*u_w3; cs += w*u_c3; ws += w;',
  '  w = nw(p, vec2(cx+0.85*sp+0.12*cos(tm*0.50+1.3), 0.70+0.04*sin(tm*0.45+2.6)), sg*1.1)*u_w4; cs += w*u_c4; ws += w;',
  // mid — azure (blue-biased so saturation boosts stay blue, not teal)
  '  w = nw(p, vec2(cx-0.35*sp+0.18*sin(tm*0.47+5.5), 0.48+0.05*cos(tm*0.52+2.0)), sg*0.9)*u_w5; cs += w*u_c5; ws += w;',
  '  w = nw(p, vec2(cx+0.60*sp+0.15*sin(tm*0.58+2.9), 0.45+0.04*sin(tm*0.49+1.1)), sg*0.9)*u_w6; cs += w*u_c6; ws += w;',
  // low — pale ice
  '  w = nw(p, vec2(cx-0.60*sp+0.12*cos(tm*0.44+0.6), 0.28+0.03*sin(tm*0.57+3.3)), sg)*u_w7; cs += w*u_c7; ws += w;',
  '  w = nw(p, vec2(cx+0.35*sp+0.16*sin(tm*0.50+3.7), 0.26+0.04*sin(tm*0.66)), sg)*u_w8; cs += w*u_c8; ws += w;',
  // bottom anchor — near-white so the headline stays readable
  '  w = nw(p, vec2(cx, 0.00), sg*1.6)*1.5*u_w9; cs += w*u_c9; ws += w;',
  // aqua node — slider at 0 removes it entirely
  '  w = nw(p, vec2(cx-0.15*sp+0.28*sin(tm*0.30+1.8), 0.42+0.08*cos(tm*0.37)), sg*0.85)*u_aqua*u_w10; cs += w*u_c10; ws += w;',
  // mouse — a light node mixed into the mesh under the cursor
  '  w = infl*u_mstr*0.85; cs += w*vec3(0.600,0.780,0.980); ws += w;',
  '  vec3 c = cs/max(ws,1e-4);',
  '  c *= u_bright;',
  '  float lum = dot(c, vec3(0.2126,0.7152,0.0722));',
  '  c = mix(vec3(lum), c, u_sat);',
  '  vec3 k = vec3(0.57735);',
  '  float ca = cos(u_hue);',
  '  c = c*ca + cross(k,c)*sin(u_hue) + k*dot(k,c)*(1.0-ca);',
  '  float gx = c.g - mix(c.r, c.b, 0.5);',
  '  c.g -= max(gx, 0.0)*u_gtrim;',
  '  c *= 1.0-u_dark;',
  '  c += (hash21(gl_FragCoord.xy + fract(u_time))-0.5)*(2.0/255.0);',
  '  gl_FragColor = vec4(c,1.0);',
  '}'
].join('\n');

// Build one shader instance on a canvas. Returns null if WebGL is out.
/* `glOpts` is the one thing this file gained on the way out of index.html:
   the export tool needs `preserveDrawingBuffer`, because reading a WebGL
   canvas back as a PNG after the frame has been composited otherwise hands
   you a blank image. The page passes nothing and gets exactly what it had. */
function createMesh(canvas, config, glOpts) {
  var attrs = { antialias: false, depth: false, stencil: false };
  for (var k in (glOpts || {})) attrs[k] = glOpts[k];
  var gl = canvas.getContext('webgl', attrs);
  if (!gl) return null;

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }
  var vs = compile(gl.VERTEX_SHADER, VS);
  var fs = compile(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) return null;
  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.useProgram(prog);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  var aLoc = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(aLoc);
  gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);

  var U = {};
  ['u_res','u_time','u_mouse','u_dark','u_aqua','u_sat','u_bright',
   'u_hue','u_gtrim','u_blur','u_spread','u_speed','u_mstr','u_mrad'].forEach(function (n) {
    U[n] = gl.getUniformLocation(prog, n);
  });
  var UC = [], UW = [];
  for (var i = 0; i < 11; i++) {
    UC.push(gl.getUniformLocation(prog, 'u_c' + i));
    UW.push(gl.getUniformLocation(prog, 'u_w' + i));
  }

  var inst = {
    canvas: canvas,
    config: config,
    resize: function (w, h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    },
    draw: function (t, mx, my) {
      var P = config.params;
      gl.uniform2f(U.u_res, canvas.width, canvas.height);
      gl.uniform1f(U.u_time, t);
      gl.uniform2f(U.u_mouse, mx, my);
      gl.uniform1f(U.u_dark,   P.darkness);
      gl.uniform1f(U.u_aqua,   P.aqua);
      gl.uniform1f(U.u_sat,    P.saturation);
      gl.uniform1f(U.u_bright, P.brightness);
      gl.uniform1f(U.u_hue,    P.hue);
      gl.uniform1f(U.u_gtrim,  P.greenTrim);
      gl.uniform1f(U.u_blur,   P.blur);
      gl.uniform1f(U.u_spread, P.spread);
      gl.uniform1f(U.u_speed,  P.speed);
      gl.uniform1f(U.u_mstr,   P.mouseStrength);
      gl.uniform1f(U.u_mrad,   P.mouseRadius);
      for (var i = 0; i < 11; i++) {
        gl.uniform3f(UC[i], config.colors[i][0], config.colors[i][1], config.colors[i][2]);
        gl.uniform1f(UW[i], config.weights[i]);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  };
  return inst;
}
  window.PaveMesh = {
    NODE_NAMES: NODE_NAMES,
    defaultConfig: defaultConfig,
    SPEC: SPEC,
    VS: VS,
    FS: FS,
    createMesh: createMesh,
  };
})();
