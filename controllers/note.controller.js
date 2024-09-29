const { validationResult } = require("express-validator");
const globalEmitter = require("../emitter/globalEmitter");
const Note = require("../models/note.model");

async function getNotes(req, res) {
  try {
    let id = req.userId;
    let data = await Note.find({ userId: id });
    if (data.length === 0) {
      return res.status(404).json({
        error: "No notes found for this user!!!",
      });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "No notes found!!!",
    });
  }
}

async function getNote(req, res) {
  try {
    let noteId = req.params.id;
    let noteData = await Note.findOne({ _id: noteId, userId: req.userId });
    if (!noteData) {
      return res.status(404).json({
        error: "Notes doesn't exists!!!",
      });
    }

    if (noteData.userId.toString() !== req.userId) {
      return res.status(401).json({
        error: "Unauthorized access!!",
      });
    }
    res.status(200).json({
      data: noteData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "No notes found!!!",
    });
  }
}

async function createNote(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array(),
    });
  }

  let { title, body } = req.body;
  try {
    let note = await Note.create({
      userId: req.userId,
      title: title,
      body: body,
    });
    res.status(201).json({
      data: note,
      message: "Note created successfully",
    });
    globalEmitter.emit("createNote", note._id);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

async function updateNote(req, res) {
  try {
    let noteId = req.params.id;
    let noteData = await Note.findOne({ _id: noteId, userId: req.userId });
    if (!noteData) {
      return res.status(404).json({
        error: "Note doesn't exists!!",
      });
    }

    let { title, body } = req.body;
    let note = {};
    if (title) {
      note.title = title;
    }
    if (body) {
      note.body = body;
    }

    noteData = await Note.findByIdAndUpdate(
      noteId,
      { $set: note },
      { new: true }
    );
    res.status(200).json({
      data: noteData,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

async function deleteNote(req, res) {
  try {
    let noteId = req.params.id;
    let noteData = await Note.findOne({ _id: noteId, userId: req.userId });
    if (!noteData) {
      return res.status(404).json({
        error: "Note doesn't exists!!",
      });
    }

    let deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      return res.status(404).json({
        error: "Note doesn't exist!!",
      });
    }
    res.json({
      message: "Note deleted successfully",
    });
    globalEmitter.emit("deleteNote", deletedNote._id);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

module.exports = { getNote, getNotes, createNote, updateNote, deleteNote };
