export default function notFound(req, res) {
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "404 not found" })); //TODO add 404 page
}
