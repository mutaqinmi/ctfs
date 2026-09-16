import Docker from 'dockerode';

export const docker = new Docker({
    socketPath: '/var/run/docker.sock',
});

const info = await docker.info();
console.log(info);