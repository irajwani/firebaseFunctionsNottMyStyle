const functions = require('firebase-functions');
// const Chatkit = require('@pusher/chatkit-server');

// const Storage = require('@google-cloud/storage');
// const gcs = Storage();

// const {tmpdir} = require('os');
// const {join, dirname} = require('path');
// const sharp = require('sharp');

// const fs = require('fs-extra');

// const {CHATKIT_SECRET_KEY, CHATKIT_INSTANCE_LOCATOR} = require('./keys.js')
// // ///Users/{uid}/{profile}/uri/
// const chatkit = new Chatkit.default({
//     instanceLocator: CHATKIT_INSTANCE_LOCATOR,
//     key: CHATKIT_SECRET_KEY,
// });
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();


//local functions:
function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);
    return Math.floor(seconds/86400);
    
}

function removeFalsyValuesFrom(object) {
    const newObject = {};
    Object.keys(object).forEach((property) => {
      if (object[property]) {newObject[property] = object[property]}
    })
    return Object.keys(newObject);
}
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


// function getAllMethodNames(obj) {
//     let methods = new Set();
//     //Imad used incorrect equals signs here though,
//     while (obj = Reflect.getPrototypeOf(obj)) {
//       let keys = Reflect.ownKeys(obj)
//       keys.forEach((k) => methods.add(k));
//     }
//     return methods;
//   }

// console.log(getAllMethodNames(chatkit))
// console.log(Object.keys(chatkit), chatkit, Chatkit);
//FUNCTION NUMBAH 0:
//TODO: reawaken
// exports.deleteConversation = functions.database.ref('/Users/{uid}/conversations/{roomId}').onDelete( 
//     (snapshot, context) => {
    
//     var roomId = context.params.roomId;
//     // console.log(chatkit);
//     //TODO: Assuming that this function will quietly fail if this room has already been deleted. 
//     chatkit.deleteRoom({id: roomId})
//     .then(() => {
//         console.log(`deleted room ${roomId} forever.`);
//         return null;
//     })
//     .catch((err) => console.log(`failed to delete room: ${roomId} because of: ${err}`))

//     }
// )

// exports.leaveYourRooms = functions.https.onRequest( (req, res) => {

// })

// exports.leaveYourRooms = functions.database.ref('/users/{uid}/usersBlocked/').onWrite( 
//     (snapshot, context) => {
//         var rawUsersBlocked = snapshot.val();
//         var usersBlocked = removeFalsyValuesFrom(rawUsersBlocked);
//         var uid = context.params.uid;
//         //if you block any user, then remove:
//         //1. cloud db reference from conversations
//         //2. pusher chatkit room

// })

//FUNCTION NUMBAH 1 :
//TODO: reawaken
// exports.createNewUser = functions.database.ref('/Users/{uid}/profile/').onCreate( 
//     (snapshot, context) => {
//         //maybe do on oncreate for profile and then access uri and name 
//     // console.log('User edited profile and added name');
//     var profile = snapshot.val();
//     var name = profile.name;
//     var uri = profile.uri;
//     var uid = context.params.uid;
//     // console.log(context.params.profile);
//     // console.log(name);
//     // console.log(uri, name, uid);
    
    
//     chatkit.createUser({
//         id: uid,
//         name: name,
//         })
//         .then( () => {
//             console.log('success');
//             return null})
//         .catch( () => {console.log('user already exists or failed to create new user')});
//     //and if the user doesn't already have a room, right now the promise will be rejected 
//     //and this function will update the user's properties.
//     // chatkit.updateUser({
//     //     id: uid,
//     //     name: name,
//     //     avatarURL: uri
//     //   }).then(() => {
//     //       console.log('User updated successfully');
//     //       return null
//     //     }).catch((err) => {
//     //       console.log(err);
//     //     });
        
//     // chatkit.getUsers()
//     //     .then((res) => {
//     //         console.log(res);
//     //         return null
//     //     }).catch((err) => {
//     //         console.log(err);
//     //     });    
    
//     return null;
// } );

// //TODO: reawaken
// //FUNCTION NUMBAH 2
// //Going to assume people will only change their pictures, and not their names
// exports.updateOldUser = functions.database.ref('/Users/{uid}/{profile}/uri').onWrite( 
//     (snapshot, context) => { 
//     // console.log('User updated profile picture');
//     var uri = snapshot.after.val();
//     var uid = context.params.uid;
//     // console.log(uri, uid);
    
//     chatkit.updateUser({
//         id: uid,
//         avatarURL: uri
//       }).then(() => {
//           console.log('User updated successfully');
//           return null
//         }).catch((err) => {
//           console.log(err);
//         });
        
    
//     return null;
// } );


//FUNCTION NUMBAH 2.99
//Delete product from products branch if user deletes product from personal user branch

exports.deleteProductFromProducts = functions.database.ref('/Users/{uid}/products/{key}').onDelete(
    (snapshot, context) => {
        //TODO: remove cloud storage instance
        //TODO: remove all priceReduction notifications for product
        admin.database().ref(`/Products/${context.params.key}`).remove();
        return null
    }
)

//FUNCTION NUMBAH 3
//Problem: When user deletes all products, it wipes away the whole products branch. 
//Fix: This func creates an empty products branch for the user.

exports.updateEmptyProducts = functions.database.ref('/Users/{uid}/products').onDelete(
    (snapshot, context) => {
        console.log(`User: ${context.params.uid} deleted all products`);
        var updates = {};
        
        updates['/Users/' + context.params.uid + '/products/'] = '';
        admin.database().ref().update(updates);

        return null;
    }
)

//FUNCTION NUMBAH 4
//TODO: need to add another wildcard of room Id
// exports.populateConversations = functions.database.ref('Users/{uid}/lastMessage/{roomId}/').onWrite(
//     (snapshot, context) => {
//         var lastMessage = snapshot.after.val();
//         var roomId = context.params.uid;
//         var uid = context.params.uid;
//         console.log(lastMessage, uid);
//         admin.database().ref().once("value", (snapshot) => {
//             var d = snapshot.val();
//             chatkit.getRoomMessages({
//                 roomId: roomId,
//                 direction: "newer",
//                 limit: 1
//             })
//             .then( (roomMessages) => {
//                 console.log(roomMessages);
//                 // var lastMessageText = false, lastMessageSenderIdentification = false, lastMessageDate = false;
//                 // if(roomMessages.length > 0) {
//                 //   lastMessageText = (roomMessages['0'].text).substr(0,40);
//                 //   lastMessageDate = new Date(roomMessages['0'].updated_at).getDay();
//                 //   lastMessageSenderIdentification = roomMessages['0'].user_id;
//                 // }
//                 // var buyerIdentification = room.created_by_id;
//                 // var buyer = d.Users[buyerIdentification].profile.name;
//                 // var buyerAvatar = d.Users[buyerIdentification].profile.uri;
//                 // var sellerIdentification = room.member_user_ids.filter( (id) => id !== buyerIdentification )[0];
//                 // var seller = d.Users[sellerIdentification].profile.name;
//                 // var sellerAvatar = d.Users[sellerIdentification].profile.uri;
//                 // var productIdentification = room.name.split(".")[0];
//                 // var productImageURL = d.Users[sellerIdentification].products[productIdentification].uris[0]
//                 // var obj = { 
//                 //   productSellerId: sellerIdentification, productImageURL: productImageURL, 
//                 //   createdByUserId: buyerIdentification, name: room.name, id: room.id, 
//                 //   buyerIdentification, sellerIdentification,
//                 //   seller: seller, sellerAvatar: sellerAvatar, 
//                 //   buyer: buyer, buyerAvatar: buyerAvatar,
//                 //   lastMessageText, lastMessageDate, lastMessageSenderIdentification
//                 // };
//                 // var updates = {};
//                 // updates['Users/' + buyerIdentification + '/conversations/' + room.id + '/' ] = obj
//                 // admin.database().ref().update(updates);
//                 // updates['Users/' + sellerIdentification + '/conversations/' + room.id + '/' ] = obj
//                 // admin.database().ref().update(updates);
//                 return null
//             })
//             .catch( (e) => console.log(e));
//             // return null
//          } )
        
//         }
// )
        



        // admin.database().ref().once("value", (snapshot) => {
        //     var d = snapshot.val();
        //     var users = Object.keys(d.Users);
        //     //TODO: remove the nested promises by getting all require properties with one chatkit.someMethod
        //     users.forEach((user_id) => {
        //         chatkit.getUserRooms({
        //           userId: user_id,
        //         })
        //           .then((rooms) => {
          
        //             if(rooms.length < 1) {
        //               console.log('user does not have rooms');
        //             }
          
        //             else {
        //               rooms.forEach( (room, index) => {
        //                 if(!index) {
        //                   console.log('skipping Users Room')
        //                 }
        //                 else {
            
        //                   chatkit.getRoomMessages({
        //                     roomId: room.id,
        //                     direction: "newer",
        //                     limit: 1
        //                   })
        //                   .then( (roomMessages) => {
        //                     var lastMessageText = false, lastMessageSenderIdentification = false, lastMessageDate = false;
        //                     if(roomMessages.length > 0) {
        //                       lastMessageText = (roomMessages['0'].text).substr(0,40);
        //                       lastMessageDate = new Date(roomMessages['0'].updated_at).getDay();
        //                       lastMessageSenderIdentification = roomMessages['0'].user_id;
        //                     }
        //                     var buyerIdentification = room.created_by_id;
        //                     var buyer = d.Users[buyerIdentification].profile.name;
        //                     var buyerAvatar = d.Users[buyerIdentification].profile.uri;
        //                     var sellerIdentification = room.member_user_ids.filter( (id) => id !== buyerIdentification )[0];
        //                     var seller = d.Users[sellerIdentification].profile.name;
        //                     var sellerAvatar = d.Users[sellerIdentification].profile.uri;
        //                     var productIdentification = room.name.split(".")[0];
        //                     var productImageURL = d.Users[sellerIdentification].products[productIdentification].uris[0]
        //                     var obj = { 
        //                       productSellerId: sellerIdentification, productImageURL: productImageURL, 
        //                       createdByUserId: buyerIdentification, name: room.name, id: room.id, 
        //                       buyerIdentification, sellerIdentification,
        //                       seller: seller, sellerAvatar: sellerAvatar, 
        //                       buyer: buyer, buyerAvatar: buyerAvatar,
        //                       lastMessageText, lastMessageDate, lastMessageSenderIdentification
        //                     };
        //                     var updates = {};
        //                     updates['Users/' + buyerIdentification + '/conversations/' + room.id + '/' ] = obj
        //                     admin.database().ref().update(updates);
        //                     updates['Users/' + sellerIdentification + '/conversations/' + room.id + '/' ] = obj
        //                     admin.database().ref().update(updates);
        //                     return null;
        //                   })
        //                   .catch( err => {
        //                       console.log(err);
        //                       return null
        //                   } )
            
                          
            
        //                 }
                        
                        
        //               }
            
        //               )
        //             }
                    
                    
          
          
        //             return null;
        //             // console.log(rooms);
        //           })
        //           .catch((err) => {
        //             console.error(err);
        //           });
        //       } )
        //     return null;
        // })
        // return null;



//FUNCTION NUMBAH 5 ?
//TODO: reawaken
exports.updateProducts = functions.database.ref('Users/{uid}/products').onWrite(
    (snapshot, context) => {
        // console.log('Initializing Reconstruction of Products Branch');
        // console.log(`Before: ${snapshot.before.val()}`)
        // console.log(`After: ${snapshot.after.val()}`)
        admin.database().ref().once("value", (dataFromReference) => {
            var d = dataFromReference.val();
            var suggestedDiscount = 0.80;
            var uids = Object.keys(d.Users);
            // console.log(uids)
            var keys = [];
            //get all keys for each product iteratively across each user
            for(uid of uids) {
                if(Object.keys(d.Users[uid]).includes('products') ) {
                Object.keys(d.Users[uid].products).forEach( (key) => keys.push(key));
                }
            }
            // console.log(keys.length);
            var 
            products = [], updates,
            chatUpdates = {},
            postData,
            i = 0;
            //go through all products in each user's branch and update the Products section of the database
            for(const uid of uids) {
                for(const key of keys) {

                  

                if( !(i > keys.length - 1) && (i <= keys.length - 1)  && (Object.keys(d.Users[uid]).includes('products')) && (Object.keys(d.Users[uid].products).includes(key)) ) {
                    
                    // console.log(key, uid, i, keys.length);
                            
                    var daysElapsed;
                    var currentProduct = d.Users[uid].products[key];

                    daysElapsed = timeSince(d.Users[uid].products[key].text.time);
                    //TODO: condition: daysElapsed >= 6
                    var shouldReducePrice = (daysElapsed >= 6) && (currentProduct.text.sold === false) ? true : false;

                    if(shouldReducePrice) {
                        var priceReductionNotificationUpdate = {};
                        var currentNotificationRef = `/Users/${uid}/notifications/priceReductions/${key}/`;
                        //New process where we try to eliminate usage of localNotificationSent and base it on time
                        //create fresh new Obj if it's the first time, which can be verified from if whether 
                        //this notification already exists in user's branch for priceReductionNotifications
                        var isFirstTime = !(Object.keys(d.Users[uid].notifications.priceReductions).includes(key)) || typeof d.Users[uid].notifications.priceReductions === "undefined";
                        
                        if(isFirstTime) {
                            var notificationPostData = {

                            name: currentProduct.text.name,
                            brand: currentProduct.text.brand,
                            price: currentProduct.text.price, //the selling price the user agreed to post this item for
                            uri: currentProduct.uris.thumbnail[0],
                            daysElapsed: daysElapsed,
                            message: `Nobody has initiated a chat about, ${currentProduct.text.name} from ${currentProduct.text.brand} yet, since its submission on the market ${currentProduct.text.daysElapsed} days ago 🤔. Consider a price reduction from £${currentProduct.text.price} \u2192 £${Math.floor(suggestedDiscount*currentProduct.text.price)}?`,

                            //pre-set a boolean to check if whether localNotification has been scheduled from client-side.
                            uid: uid,
                            key: key,
                            //set this to true after it has been marked as true from client side, possibly faulty logic
                            localNotificationSent: false,
                            // localNotificationSent: d.Users[uid].notifications.priceReductions[key].localNotificationSent !== undefined ? d.Users[uid].notifications.priceReductions[key].localNotificationSent === true ? true : false : false,
                            // localNotificationSent: d.Users[uid].notifications ? d.Users[uid].notifications.priceReductions ? d.Users[uid].notifications.priceReductions[key].localNotificationSent === true ? true : false : false : false,
                            /// Should we just force empty address properties here?
                            // address:
                            
                            //mark as unread
                            // unreadCount: true,
                            unreadCount: true,
                            selected: false,
                            
                        }
                        //now update the singular sub-branch with entire object as it's the first time
                        priceReductionNotificationUpdate[currentNotificationRef] = notificationPostData;
                    }

                    else {
                        //this object already exists in priceReductionNotifications,
                        //notifications have sent if person has opened the app,
                        //unreadCount is untampered
                        priceReductionNotificationUpdate[currentNotificationRef + '/name'] = currentProduct.text.name;
                        priceReductionNotificationUpdate[currentNotificationRef + '/brand'] = currentProduct.text.brand;
                        priceReductionNotificationUpdate[currentNotificationRef + '/price'] = currentProduct.text.price;
                        priceReductionNotificationUpdate[currentNotificationRef + '/uri'] = currentProduct.uris.thumbnail[0];
                        priceReductionNotificationUpdate[currentNotificationRef + '/daysElapsed'] = daysElapsed;
                        priceReductionNotificationUpdate[currentNotificationRef + '/message'] = `Nobody has initiated a chat about, ${currentProduct.text.name} from ${currentProduct.text.brand} yet, since its submission on the market ${currentProduct.text.daysElapsed} days ago 🤔. Consider a price reduction from £${currentProduct.text.price} \u2192 £${Math.floor(suggestedDiscount*currentProduct.text.price)}?`;
                        priceReductionNotificationUpdate[currentNotificationRef + '/uid'] = uid;
                        priceReductionNotificationUpdate[currentNotificationRef + '/key'] = key;
                        priceReductionNotificationUpdate[currentNotificationRef + '/selected'] = false;
                    }


                        // console.log(notificationPostData);
                        
                        admin.database().ref().update(priceReductionNotificationUpdate)

                    }
                        
                    postData = {
                        key: key, uid: uid, 
                        uris: {source: currentProduct.uris.source, thumbnail: currentProduct.uris.thumbnail, pd: currentProduct.uris.pd}, 
                        //TODO: below is why uris gets tacked on as extra property
                        text: currentProduct.text, daysElapsed: daysElapsed, 
                        //set property right now to easen burden on notification scheduling chain
                        shouldReducePrice: shouldReducePrice ? true : false,
                    }

                    console.log(postData);
                    
                    console.log("The current index and product identifier is: " + i, postData.key);    
                    console.log("The current Uris obj is: " + currentProduct.uris);
                    console.log(currentProduct);
                    updates = {};   
                    // updates['/Products/' + i + '/'] = postData;
                    updates['/Products/' + key + '/'] = postData;
                    admin.database().ref().update(updates);
                    i++;
                    // console.log(i);
    
                            
    
                        
                    
                    
                }

                

                

                
                
                }
            }
            
            
            return null;
        })

        return null;
    }
)

//Function Numbah 8:
//Delete a product from Products/ once it is deleted from Users/Products/Key
//Not necessary since permanent product deletion is handled from client side, 
//TODO: delete chatRoom product was associated with AND delete in cloud image storage
// exports.deleteProduct = functions.database.ref('/Users/{uid}/products/{productKey}').onDelete(
//     (snapshot, context) => {
//         console.log(`User: ${context.params.uid} deleted all products`);
//         updates['/Users/' + context.params.uid + '/products/'] = '';
//         admin.database().ref().remove();

//         return null;
//     }
// )



//Function Numbah TBD - For each image uploaded of a product, generate a smaller thumbnail sized image for faster client-side loading


// exports.generateThumbnails = functions.storage.object().onFinalize( async object => {
//     const bucket = gcs.bucket(object.bucket);
//     const filePath = object.name; //get filePath for image in firebase cloud storage
//     const fileName = filePath.split('/').pop(); //get array of names in the filePath
//     const bucketDir = dirname(filePath);

//     //tmpdir handles process of creating tempory working directory to store thumbnials in
//     const workingDir = join(tmpdir(), 'thumbnails');
//     const tmpFilePath = join(workingDir, 'source.png');

//     //need this statement to exit out of the function at some point
//     if(fileName.includes('thumbnail@') || !object.contentType.includes('image')) {
//         console.log('exiting function');
//         return false;
//     }

//     //Ensure directory exists
//     await fs.ensureDir(workingDir);

//     //Download source file temporarily to local node storage
//     await bucket.path(fileName).download({
//         destination: tmpFilePath
//     });

//     //Resize images and define array of upload promises
//     const sizes = [64, 128];

//     const uploadPromises = sizes.map( async (size) => {
//         const thumbnailName = `thumbnail@${size}_${fileName}`;
//         const thumbnailPath = join(workingDir, thumbnailName);

//         await sharp(tmpFilePath)
//             .resize(size, size)
//             .toFile(thumbnailPath);

//         return bucket.upload(thumbnailPath), {
//             destination: join(bucketDir, thumbnailName)
//         };

        

//     });

//     await Promise.all(uploadPromises);

//     //remove the tmp thumbnails locally
//     return fs.remove(workingDir);


// })




// exports.dbWrite = functions.database.ref('/path/with/{id}').onWrite((data, context) => {
//     const authVar = context.auth; // Auth information for the user.
//     const authType = context.authType; // Permissions level for the user.
//     const pathId = context.params.id; // The ID in the Path.
//     const eventId = context.eventId; // A unique event ID.
//     const timestamp = context.timestamp; // The timestamp at which the event happened.
//     const eventType = context.eventType; // The type of the event that triggered this function.
//     const resource = context.resource; // The resource which triggered the event.
//     // ...
//   });