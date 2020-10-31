const user = require("../app/models/userModel.js");
const cache = require('../middleware/redisCache.js');
const note = require('../app/models/noteModel');

class CollaboratorService {

  /**
    *@params {object} data
   * @returns {callback function} callback
   * @description Gets all the regiserted user emails
   */
    findAllRegisteredEmails = (data, callback) => {
        user.getAllUsers(data, (err, result) => {
            if(err) {
                return callback(err, null);
            }
            cache.setAllEmailIds(result);
            return callback(null, result);
        });
    }

    /**
   * @params {object} data
   * @returns {callback function} callback
   * @description create collaborator on a note
   */
  createCollaboratorOnNote = (data, callback) => {
      const collabData = {
          emailId: data.collaboratorEmail
      }
      user.findUser(collabData, (err, result) => {
          if(err || result == null) {
              return callback(err, null);
          }else {
              const collabDetail = {
                  collaboratorEmail: result.emailId,
                  userId: result._id,
                  noteId: data.noteId
              }
            return note.addCollaboratorToNote(collabDetail, callback);
          }
      });
    };

  /**
   * @params {object} data
   * @returns {callback function} callback
   * @description delete collaborator on a note
   */
  deleteCollaboratorOnNote = (data, callback) => {
    note.findCollaboratorsOnNote(data.noteId, (err, result) => {
      if(err) {
        return callback(err, null);
      }else {
        const newArray = [];
        result.forEach(element => {
          if(element.collaboratorEmail != data.collaboratorEmail) {
              newArray.push(index);
            }
          
        });
        const collabToUpdate = {
          _id: data.noteId,
          collaborators: newArray
        }
        note.updateLabelOnNote(collabToUpdate, callback);
      }
    });
  }

  /**
   * @params {object} data
   * @returns {callback function} callback
   * @description Find all collaborators on a note
   */
  getAllCollaborators = (data, callback) => {
    return note.findCollaboratorsOnNote(data.noteId, callback);
  }
}

module.exports = new CollaboratorService();

