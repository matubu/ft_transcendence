import posts from './_posts'

const lookup = new Map()
posts.forEach(post => 
	lookup.set(post.slug, JSON.stringify(post)))

export function get(req, res, next) {
	// the `id` parameter is available because
	// this file is called [id].json.ts
	const { id } = req.params

	if (lookup.has(id)) {
		res.writeHead(200, { 'Content-Type': 'application/json' })
		res.end(lookup.get(id))
	} else {
		res.writeHead(404, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify({ message: `Not found` }))
	}
}
