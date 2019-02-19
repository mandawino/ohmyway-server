'use strict'
const Hapi = require('hapi')
// const Boom = require('boom')
const Path = require('path')
const Inert = require('inert')
const fs = require('fs');
const Good = require('good')


let goodOptions = {
	ops: {
		interval: 600000
	},
	reporters: {
		console: [
			{
				module: 'good-console',
				args: [{ log: ['error'], response: '*' }]
			}, 
			'stdout'
		]
	}
}

const server = Hapi.Server({
		host: 'localhost',
		port: 8080,
		routes: { cors: true }
})

/**
 * Scan a directory and return the path of every file in it
 * @param {the directory to scan} dir 
 * @param {the files already treated (recursion)} filelist 
 */
const scan = (dir, filelist = {}) => {
	fs.readdirSync(dir).forEach(file => {
		if(!(/^\./.test(file))) {
	    	filelist[file] = fs.statSync(Path.join(dir, file)).isDirectory()
	    		? scan(Path.join(dir, file), filelist[file])
	    		: Path.join(dir, file);
    	}})
    return filelist;
}

/**
 * Helloworld to check the aliveness of the server
 */
server.route({
	method: 'GET',
	path: '/',
	handler: () => {
		return 'Hello world'
	}
})

/**
 * Get all images
 */
server.route({
	method: 'GET',
	path: '/images',
	handler: (request, h) => {
		const response = h.response(scan(Path.join(__dirname, 'images')))
		response.type('text/plain')
		return response
	}
})

/**
 * Get all images from a country and an optional location
 */
server.route({
	method: 'GET',
	path: '/images/{country}/{location?}',
	handler: (request, h) => {
		const country = encodeURIComponent(request.params.country)
		const location = encodeURIComponent(request.params.location)
		const response = (location == 'undefined' || location == 'null')  ? 
			h.response(scan(Path.join(__dirname, 'images', country))) :
			h.response(scan(Path.join(__dirname, 'images', country, location)));
		response.type('text/plain')
		return response
	}
})

/**
 * Get the image for the given path
 */
server.route({
	method: 'GET',
	path:'/image',
	handler: (request, h) => {
		const path = request.query.path;
		const response = h.file(path)
		//return response.encoding('base64')
		return response
	}
})

const start = async () => {
	try {
		await server.register([{
			plugin: Good,
			options: goodOptions
		}, {
			plugin: Inert,
			options: {}
		}])
		await server.start()
		console.log(`Hapi server running at ${server.info.uri}`);
	} catch (err) {
		console.log("Hapi error starting server", err);
	}
}

start();