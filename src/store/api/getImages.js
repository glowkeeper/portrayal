import { compose, prop } from 'ramda'

import { StoreActions } from '../store'

import { IO, flickrCroppedSquarePhotos, flickrLargePhotos, flickrQuery } from '../../utils/iO'

import { map } from '../../utils/utils'

export const getImages = (store) => {

    store.dispatch({ 
        type: StoreActions.imagesInit
    });

    IO.getData(flickrData => {

        //console.log('flickr data', flickrData)
         
        const imageURLs = compose(map(imageData => {

            // console.log('imagedata', imageData)
            const { server, id, secret } = imageData

            const imageCroppedURL = flickrCroppedSquarePhotos(server, id, secret)
            const imageLargeURL = flickrLargePhotos(server, id, secret)
            const imageURLs = {
                cropped: imageCroppedURL,
                large: imageLargeURL
            }
            //uRLs.push(imageURLs)
            store.dispatch({ 
                type: StoreActions.imagesUpdate,
                payload: [imageURLs]
            });
        }), prop('photo'), prop('photos'));

        if (flickrData.status === 'OK') {
            imageURLs(flickrData.data)
        }                
    
    }, null, flickrQuery)
}