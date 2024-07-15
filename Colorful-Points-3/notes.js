    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_DST_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_DST_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
gl.depthFunc(gl.EQUAL)
gl.depthFunc(gl.LESS)

gl.disable(gl.DEPTH_TEST);
gl.enable(gl.DEPTH_TEST);
gl.depthMask(true);
gl.depthMask(false);