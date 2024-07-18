gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

gl.clearColor(0.0, 0.0, 0.0, 1.);
