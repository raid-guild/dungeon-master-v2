import { fetchToken, pinImageFile } from '@raidguild/dm-utils';
import { convertIpfsCidV0ToByte32 } from '@raidguild/escrow-utils';
import { useQuery } from '@tanstack/react-query';

const usePinataUpload = ({
  imageFile,
  imageName,
}: {
  imageFile: Blob;
  imageName: string;
}) => {
  const pinataUpload = async () => {
    if (!imageFile.type.startsWith('image/')) {
      throw new Error('File is not an image');
    }

    const token = await fetchToken();
    const imageDetails = await pinImageFile(imageFile, imageName, token);

    return imageDetails;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['pinataUpload', { imageFile, imageName }],
    queryFn: pinataUpload,
    enabled: !!imageFile && !!imageName,
  });

  return { data, isLoading, error };
};

export default usePinataUpload;
