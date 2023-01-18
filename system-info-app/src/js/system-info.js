const sys = require('systeminformation');


async function getSystemInformation() {

    var cpuInfo = await sys.cpu();
    var graphicsInfo = await sys.graphics();
    var osInfo = await sys.osInfo();
    var systemInfo = await sys.system();
    var memInfo = await sys.mem();

    return {
        model: systemInfo.model,
        edition: osInfo.distro,
        os: osInfo.platform,
        architecture: osInfo.arch,
        processor: cpuInfo.brand,
        graphics: graphicsInfo.controllers[0].model,
        ram: `${Math.round((memInfo.total) * (Math.pow(10, -9)))} GB`
    }
}


module.exports = {
    getSystemInformation
}