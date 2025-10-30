import fs from 'fs'
import path from 'path'

const EXCLUDE_DIRS = ['node_modules', '.nuxt', 'dist', '.output', '.git']
const EXTENSIONS = ['.vue', '.ts', '.js']

function cleanContent(content: string): string {
  let cleaned = content

  cleaned = cleaned.replace(/console\.(log|debug|info)\s*\([^)]*\)\s*;?\s*/g, '')

  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '')

  cleaned = cleaned.replace(/\/\/.*$/gm, '')

  cleaned = cleaned.replace(/\b(TODO|FIXME|NOTE|HACK|XXX)[\s:][^\n]*/gi, '')

  cleaned = cleaned.replace(/\n{3,}/g, '\n\n')

  return cleaned.trim() + '\n'
}

function walkDir(dir: string, cleanedFiles: string[] = []): string[] {
  const files = fs.readdirSync(dir, { withFileTypes: true })

  for (const file of files) {
    const fullPath = path.join(dir, file.name)

    if (file.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(file.name)) {
        walkDir(fullPath, cleanedFiles)
      }
    } else if (file.isFile()) {
      const ext = path.extname(file.name)
      if (EXTENSIONS.includes(ext) && !fullPath.includes('clean-code.ts')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8')
          const cleaned = cleanContent(content)

          if (content !== cleaned) {
            fs.writeFileSync(fullPath, cleaned, 'utf8')
            cleanedFiles.push(path.relative(process.cwd(), fullPath))
          }
        } catch (error) {
          console.error(`Erreur sur ${fullPath}:`, error)
        }
      }
    }
  }

  return cleanedFiles
}

const cleanedFiles = walkDir(process.cwd())

if (cleanedFiles.length > 0) {
  cleanedFiles.forEach(f => console.error(`  ${f}`))
}
console.error(`\nNettoyage terminé: ${cleanedFiles.length} fichiers modifiés`)
