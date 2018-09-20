export default function getErrorMessage(error) {
  let { message } = error;
  if (error.message.toString().indexOf('FOREIGN KEY') > 0) {
    message = 'The document with ' + message.slice(message.lastIndexOf('column') + 7, message.length - 1) + ' does not exist in the relevant table';
  }
  return message;
}
