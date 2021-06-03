"use strict";

const Helpers = use("Helpers");
const fs = use("fs");
const path = use("path");
const removeFile = Helpers.promisify(fs.unlink);
const News = use("App/Models/News");
const NewsFile = use("App/Models/NewsFile");
const RandomString = require("randomstring");
const Moment = require("moment");
const voca = require("voca");

class NewsController {
  async index({ request, response }) {
    try {
      let data = await News.query().with("users").orderBy("id", "desc").fetch();
      console.log(data);

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async get({ request, response }) {
    try {
      let data = await News.query()
        .with("users")
        .with("newsFiles")
        .where("id", request.input("id"))
        .first();

      if (!data) {
        return response.status(404).send({
          message: "not found",
        });
      }

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async create({ auth, request, response }) {
    try {
      let fileName, movedFiles;
      let user = await auth.getUser();
      let random = RandomString.generate({
        capitalization: "lowercase",
      });

      // Upload multi file
      const validationFile = {
        size: "5mb",
        extnames: ["png", "jpg", "jpeg"],
      };
      let inputFiles = request.file("files", validationFile);

      if (inputFiles) {
        await inputFiles.moveAll(
          Helpers.resourcesPath("uploads/news"),
          (file) => {
            let filename = `${voca.snakeCase(
              file.clientName.split(".").slice(0, -1).join(".")
            )}_${random}.${file.extname}`;

            return {
              name: filename,
            };
          }
        );

        movedFiles = inputFiles.movedList();

        if (!inputFiles.movedAll()) {
          await Promise.all(
            movedFiles.map((file) => {
              return removeFile(
                path.join(Helpers.resourcesPath("uploads/news"), file.fileName)
              );
            })
          );

          return response.status(422).send(inputFiles.errors());
        }
      }

      // Upload image
      let inputImage = request.file("image");

      if (inputImage) {
        fileName = `${voca.snakeCase(
          inputImage.clientName.split(".").slice(0, -1).join(".")
        )}_${random}.${inputImage.extname}`;

        await inputImage.move(Helpers.resourcesPath("uploads/news"), {
          name: fileName,
        });

        if (!inputImage.moved()) {
          return response.status(422).send(inputImage.errors());
        }
      }

      // Insert to news table
      let news = await News.create({
        author_id: user.id,
        title: request.input("title"),
        content: request.input("content"),
      });

      if (inputFiles) {
        movedFiles.forEach(async (value) => {
          await NewsFile.create({
            news_id: news.id,
            type: "files",
            name: value.fileName,
            mime: value.extname,
            path: Helpers.resourcesPath("uploads/news"),
            url: `/api/v1/file/${value.extname}/${value.fileName}`,
          });
        });
      }

      if (inputImage) {
        await NewsFile.create({
          news_id: news.id,
          type: "banner",
          name: fileName,
          mime: inputImage.extname,
          path: Helpers.resourcesPath("uploads/news"),
          url: `/api/v1/file/${inputImage.extname}/${fileName}`,
        });
      }

      // Get data created
      let data = await News.query()
        .with("users")
        .with("newsFiles")
        .where("id", news.id)
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async edit({ request, response }) {
    try {
      let movedFiles, fileName;
      let random = RandomString.generate({
        capitalization: "lowercase",
      });

      // Upload multi file
      let inputFiles = request.file("files", {
        size: "5mb",
        extnames: ["png", "jpg", "jpeg"],
      });

      if (inputFiles) {
        await inputFiles.moveAll(
          Helpers.resourcesPath("uploads/news"),
          (file) => {
            let filename = `${voca.snakeCase(
              file.clientName.split(".").slice(0, -1).join(".")
            )}_${random}.${file.extname}`;

            return {
              name: filename,
            };
          }
        );

        movedFiles = inputFiles.movedList();

        if (!inputFiles.movedAll()) {
          await Promise.all(
            movedFiles.map((file) => {
              return removeFile(
                path.join(Helpers.resourcesPath("uploads/news"), file.fileName)
              );
            })
          );

          return response.status(422).send(inputFiles.errors());
        }
      }

      // Upload image
      let inputImage = request.file("image", {
        size: "5mb",
        extnames: ["png", "jpg", "jpeg"],
      });

      if (inputImage) {
        let findImage = await NewsFile.query()
          .where("news_id", request.input("id"))
          .andWhere("type", "banner")
          .first();

        // Delete image and data if exists
        if (findImage) {
          removeFile(
            path.join(Helpers.resourcesPath("uploads/news"), findImage.name)
          );

          await NewsFile.query().where("id", findImage.id).delete();
        }

        fileName = `${voca.snakeCase(
          inputImage.clientName.split(".").slice(0, -1).join(".")
        )}_${random}.${inputImage.extname}`;

        await inputImage.move(Helpers.resourcesPath("uploads/news"), {
          name: fileName,
        });

        if (!inputImage.moved()) {
          return response.status(422).send(inputImage.errors());
        }
      }

      // Update news table
      await News.query()
        .where("id", request.input("id"))
        .update({
          title: request.input("title"),
          content: request.input("content"),
        });

      if (inputFiles) {
        movedFiles.forEach(async (value) => {
          await NewsFile.create({
            news_id: request.input("id"),
            type: "files",
            name: value.fileName,
            mime: value.extname,
            path: Helpers.resourcesPath("uploads/news"),
            url: `/api/v1/file/${value.extname}/${value.fileName}`,
          });
        });
      }

      if (inputImage) {
        await NewsFile.create({
          news_id: request.input("id"),
          type: "banner",
          name: fileName,
          mime: inputImage.extname,
          path: Helpers.resourcesPath("uploads/news"),
          url: `/api/v1/file/${inputImage.extname}/${fileName}`,
        });
      }

      // Get data created
      let data = await News.query()
        .with("users")
        .with("newsFiles")
        .where("id", request.input("id"))
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async dump({ request, response }) {
    try {
      await News.query().where("id", request.input("id")).update({
        deleted_at: Moment.now(),
      });

      // Get data created
      let data = await News.query()
        .with("users")
        .with("newsFiles")
        .where("id", request.input("id"))
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async restore({ request, response }) {
    try {
      await News.query().where("id", request.input("id")).update({
        deleted_at: null,
      });

      // Get data created
      let data = await News.query()
        .with("users")
        .with("newsFiles")
        .where("id", request.input("id"))
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async delete({ request, response }) {
    try {
      let findImage = await NewsFile.query()
        .where("news_id", request.input("id"))
        .fetch();

      let convert = findImage.toJSON();

      convert.forEach((value) => {
        removeFile(path.join(value.path, value.name));
      });

      await NewsFile.query().where("news_id", request.input("id")).delete();
      await News.query().where("id", request.input("id")).delete();

      return response.send({
        message: "deleted",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async deleteFile({ request, response }) {
    try {
      let findFile = await NewsFile.query()
        .where("id", request.input("file_id"))
        .first();

      if (!findFile) {
        return response.status(404).send({
          message: "file not found",
        });
      }

      removeFile(path.join(findFile.path, findFile.name));

      await NewsFile.query().where("id", request.input("file_id")).delete();

      return response.send({
        message: "file deleted",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = NewsController;
