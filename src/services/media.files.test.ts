import cloudinaryBase from 'cloudinary';
import { CloudinaryService } from './media.files';

jest.mock('cloudinary');

describe('Given CloudinaryService', () => {
  cloudinaryBase.v2 = {
    config: jest.fn().mockReturnValue({}),
    uploader: {},
  } as unknown as typeof cloudinaryBase.v2;

  describe('When we instantiate it without errors', () => {
    const cloudinary = new CloudinaryService();
    beforeEach(() => {
      cloudinaryBase.v2.uploader.upload = jest.fn().mockResolvedValue(
        // eslint-disable-next-line camelcase
        { public_id: 'Test image' }
      );
    });
    test('Then its method uploadImage should be used', async () => {
      const imdData = await cloudinary.uploadImage('');
      expect(imdData).toHaveProperty('id', 'Test image');
    });
  });

  describe('When we instantiate it WITH errors', () => {
    const cloudinary = new CloudinaryService();
    beforeEach(() => {
      cloudinaryBase.v2.uploader.upload = jest.fn().mockRejectedValue({
        error: new Error('Upload error'),
      });
    });
    test('Then its method uploadImage should reject an error', async () => {
      expect(cloudinary.uploadImage('')).rejects.toThrow();
    });
  });
});
