/*
 * Copyright 2012, Gregg Tavares.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Gregg Tavares. nor the names of his
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ------ CODE MODIFIED AND PACKAGE CREATED BY ANDREW FILGUEIRAS, 2020. -------
 */

// const defaultShaderType = ['VERTEX_SHADER', 'FRAGMENT_SHADER'];

/** Make canvas fit with no problems at the screen */
export function resizeCanvas(canvas: HTMLCanvasElement): void {
  // lookup the size the browser is displaying the canvas
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  // const gl = canvas.getContext('webgl2');

  // const test = gl.VERTEX_SHADER;

  // check if the canvas is not the same size
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    // make the canvas the same size
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
}

/** Creates a shader based on a fragment or vertex GLSL file */
export function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type);

  if (shader == null) throw new Error('This shader is not valid!');

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);

    throw new Error('Error when trying to compile shader');
  }
  return shader;
}

/** Links shaders into a program */
export function createProgram(
  gl: WebGL2RenderingContext,
  shaders: WebGLShader[],
): WebGLProgram {
  const program = gl.createProgram();

  if (program == null)
    throw new Error('WebGL context error, something went wrong!');

  shaders.forEach(shader => {
    gl.attachShader(program, shader);
  });

  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (!success) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);

    throw new Error('Error when trying to link the shaders into a program.');
  }
  return program;
}

/** Create a program based on a shader and a fragment source */
export function createProgramFromSources(
  gl: WebGL2RenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string,
): WebGLProgram {
  // const shaders = [];

  // shaderSources.forEach(source => {
  //   shaders.push(createShader(gl, gl[defaultShaderType[i]], source));
  // });

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource,
  );

  const sources = [vertexShader, fragmentShader];

  return createProgram(gl, sources);
}
