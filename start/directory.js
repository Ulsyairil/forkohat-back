const fs = require('fs')
const path = require('path')

try {
  // Create carousel directory
  fs.access(path.join(process.cwd(), '/resources/uploads/carousel'), (error) => {
    if (error) {
      fs.mkdirSync(path.join(process.cwd(), '/resources/uploads/carousel'), {
        recursive: true,
      })
      console.log(`Directory created : ${process.cwd()}/resources/uploads/carousel`)
    }
  })

  // Create gallery directory
  fs.access(path.join(process.cwd(), '/resources/uploads/gallery'), (error) => {
    if (error) {
      fs.mkdirSync(path.join(process.cwd(), '/resources/uploads/gallery'), {
        recursive: true,
      })
      console.log(`Directory created : ${process.cwd()}/resources/uploads/gallery`)
    }
  })

  // Create news directory
  fs.access(path.join(process.cwd(), '/resources/uploads/news'), (error) => {
    if (error) {
      fs.mkdirSync(path.join(process.cwd(), '/resources/uploads/news'), {
        recursive: true,
      })
      console.log(`Directory created : ${process.cwd()}/resources/uploads/news`)
    }
  })

  // Create arrangements directory
  fs.access(path.join(process.cwd(), '/resources/uploads/arrangements'), (error) => {
    if (error) {
      fs.mkdirSync(path.join(process.cwd(), '/resources/uploads/arrangements'), {
        recursive: true,
      })
      console.log(`Directory created : ${process.cwd()}/resources/uploads/arrangements`)
    }
  })

  // Create arrangements items directory
  fs.access(path.join(process.cwd(), '/resources/uploads/arrangements/items'), (error) => {
    if (error) {
      fs.mkdirSync(path.join(process.cwd(), '/resources/uploads/arrangements/items'), {
        recursive: true,
      })
      console.log(`Directory created : ${process.cwd()}/resources/uploads/arrangements/items`)
    }
  })

  // Create event directory
  fs.access(path.join(process.cwd(), '/resources/uploads/event'), (error) => {
    if (error) {
      fs.mkdirSync(path.join(process.cwd(), '/resources/uploads/event'), {
        recursive: true,
      })
      console.log(`Directory created : ${process.cwd()}/resources/uploads/event`)
    }
  })
} catch (error) {
  console.log(error)
}