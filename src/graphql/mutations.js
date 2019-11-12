/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createVodAsset = `mutation CreateVodAsset($input: CreateVodAssetInput!) {
  createVodAsset(input: $input) {
    id
    title
    description
    length
    url {
      id
      url
      subscription
    }
  }
}
`;
export const updateVodAsset = `mutation UpdateVodAsset($input: UpdateVodAssetInput!) {
  updateVodAsset(input: $input) {
    id
    title
    description
    length
    url {
      id
      url
      subscription
    }
  }
}
`;
export const deleteVodAsset = `mutation DeleteVodAsset($input: DeleteVodAssetInput!) {
  deleteVodAsset(input: $input) {
    id
    title
    description
    length
    url {
      id
      url
      subscription
    }
  }
}
`;
export const createVideoObject = `mutation CreateVideoObject($input: CreateVideoObjectInput!) {
  createVideoObject(input: $input) {
    id
    url
    subscription
  }
}
`;
export const updateVideoObject = `mutation UpdateVideoObject($input: UpdateVideoObjectInput!) {
  updateVideoObject(input: $input) {
    id
    url
    subscription
  }
}
`;
export const deleteVideoObject = `mutation DeleteVideoObject($input: DeleteVideoObjectInput!) {
  deleteVideoObject(input: $input) {
    id
    url
    subscription
  }
}
`;
