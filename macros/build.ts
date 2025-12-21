export default async function() {
  return await Bun.build({
    entrypoints: ['./src/web/app.ts'],
    outdir: './public',
    tsconfig: './macros/tsconfig.json', 
    minify: {
      identifiers: false,
      whitespace: true,
      syntax: true
    }
  })
}