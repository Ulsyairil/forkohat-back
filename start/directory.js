const fs = require("fs");
const path = require("path");

try {
  fs.mkdirSync(path.join(process.cwd(), "/resources/uploads/carousel"), {
    recursive: true,
  });

  console.log(
    `Directory created : ${process.cwd()}/resources/uploads/carousel`
  );
} catch (error) {
  console.log(error);
}

try {
  fs.mkdirSync(path.join(process.cwd(), "/resources/uploads/gallery"), {
    recursive: true,
  });

  console.log(`Directory created : ${process.cwd()}/resources/uploads/gallery`);
} catch (error) {
  console.log(error);
}

try {
  fs.mkdirSync(path.join(process.cwd(), "/resources/uploads/news"), {
    recursive: true,
  });

  console.log(`Directory created : ${process.cwd()}/resources/uploads/news`);
} catch (error) {
  console.log(error);
}

try {
  fs.mkdirSync(path.join(process.cwd(), "/resources/uploads/arrangements"), {
    recursive: true,
  });

  console.log(
    `Directory created : ${process.cwd()}/resources/uploads/arrangements`
  );
} catch (error) {
  console.log(error);
}

try {
  fs.mkdirSync(path.join(process.cwd(), "/resources/uploads/event"), {
    recursive: true,
  });

  console.log(`Directory created : ${process.cwd()}/resources/uploads/event`);
} catch (error) {
  console.log(error);
}
