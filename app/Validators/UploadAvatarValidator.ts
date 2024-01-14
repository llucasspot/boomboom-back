import { schema } from '@ioc:Adonis/Core/Validator'

export default class UploadAvatarValidator {

  public schema = schema.create({
    avatar: schema.file({
      size: '5mb',
      extnames: ['jpg', 'png', 'jpeg'],
    }),
  })

  public messages = {
    'avatar.file': 'You must provide a file',
    'avatar.file_ext': 'Invalid file extension. Only png, jpg, and jpeg are allowed',
    'avatar.file_size': 'File size must be under 5MB',
    'avatar.file_types': 'Invalid file type. Only images are allowed'
  }
}
