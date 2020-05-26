var wrapped_DGLD = artifacts.require("wrapped_DGLD");

module.exports = function(deployer) {
    deployer.deploy(wrapped_DGLD);
};
