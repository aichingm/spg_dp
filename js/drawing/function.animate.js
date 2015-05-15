/**
 * Animation method
 * @returns {undefined}
 */
function animate() {
    requestAnimationFrame(animate);
    // Render the scene.
    renderer.render(scene, camera);
    controls.update();
    updateFcts.forEach(function (updateFn) {
        updateFn();
    });
}