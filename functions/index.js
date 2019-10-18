require('dotenv').config();
const functions = require('firebase-functions');
// const Chatkit = require('@pusher/chatkit-server');

// const Storage = require('@google-cloud/storage');
// const gcs = Storage();

// const {tmpdir} = require('os');
// const {join, dirname} = require('path');
// const sharp = require('sharp');

// const fs = require('fs-extra');

const {gmailConfig} = require('./keys.js')
// // ///Users/{uid}/{profile}/uri/
// const chatkit = new Chatkit.default({
//     instanceLocator: CHATKIT_INSTANCE_LOCATOR,
//     key: CHATKIT_SECRET_KEY,
// });
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

const nodemailer = require('nodemailer');
const hbs = require('nodemailer-handlebars');

// Step 1
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: gmailConfig
});

// Step 2
transporter.use('compile', hbs({
    viewEngine: 'express-handlebars',
    viewPath: './views/'
}));

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

//FUNCTION NUMBAH 1 Additional Action
exports.sendWelcomeEmail =  functions.database.ref('/Users/{uid}/profile/').onCreate((snapshot, context)=> {
    admin.auth().getUser(context.params.uid)
    .then(userRecord => {
        let sendTo = userRecord.email;
        let name = userRecord.displayName;
        console.log(sendTo, name);
        // let mailOptions = {
        //     from: 'nottmystyle.help@gmail.com', // TODO: email sender
        //     to: sendTo, // TODO: email receiver
        //     subject: `${name}, Welcome to NottMyStyle`,
        //     text: 'Wooohooo it works!!',
        //     template: 'welcome',
        //     context: {
        //         name: 'Accime Esterling'
        //     } // send extra values to template
        // };
        
        // // Step 4
        // transporter.sendMail(mailOptions, (err, data) => {
        //     if (err) {
        //         return log('Error occurs');
        //     }
        //     return log('Email sent!!!');
        // });
        return null
    })
    .catch((e)=>console.log('failed to send because ' + e))
})

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


//FUNCTION NUMBAH 3
//Delete product from products branch if user deletes product from personal user branch

exports.deleteProductFromProducts = functions.database.ref('/Users/{uid}/products/{key}').onDelete(
    (snapshot, context) => {
        //TODO: remove cloud storage instance
        //TODO: remove all priceReduction notifications for product
        admin.database().ref(`/Products/${context.params.key}`).remove();
        return null
    }
)

//FUNCTION NUMBAH 4
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



//FUNCTION NUMBAH 5 
//TODO: Unnecessarily expensive. Split into smaller functions depending on use case
exports.updateProducts = functions.database.ref('Users/{uid}/products').onWrite(
    (snapshot, context) => {
        // console.log('Initializing Reconstruction of Products Branch');
        // console.log(`Before: ${snapshot.before.val()}`)
        // console.log(`After: ${snapshot.after.val()}`)
        admin.database().ref().once("value", (dataFromReference) => {
            var d = dataFromReference.val();
            var suggestedDiscount = 0.90;
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

                  

                if( !(i > keys.length - 1) && (i <= keys.length - 1)  && (Object.keys(d.Users[uid]).includes('products')) && (Object.keys(d.Users[uid].products).includes(key))) {
                    
                    // console.log(key, uid, i, keys.length);
                    var daysElapsed;
                    var currentProduct = d.Users[uid].products[key];
                    var userCountry = d.Users[uid].profile.country;
                    userCountry = userCountry.replace(/\s+/g, '').split(',')[1];

                    if(currentProduct.uris !== undefined) {
                        

                        daysElapsed = timeSince(currentProduct.text.time);
                        //TODO: condition: daysElapsed >= 6
                        var shouldReducePrice = (daysElapsed >= 3) && (currentProduct.text.sold === false) ? true : false;

                        if(shouldReducePrice) {
                            var priceReductionNotificationUpdate = {};
                            var currentNotificationRef = `/Users/${uid}/notifications/priceReductions/${key}/`;
                            //New process where we try to eliminate usage of localNotificationSent and base it on time
                            //create fresh new Obj if it's the first time, which can be verified from if whether 
                            //this notification already exists in user's branch for priceReductionNotifications

                            //TODO: But what if the user has no priceReduction Notifications, let alone any notifications yet
                            var isFirstTime = d.Users[uid].notifications === undefined || d.Users[uid].notifications.priceReductions === undefined || !(Object.keys(d.Users[uid].notifications.priceReductions).includes(key)); 
                            //trivial || trivial || price reduction notification has never been there for this particular product's
                            let firstName = d.Users[uid].profile.name.split(" ")[0];
                            let message = `Hey ${firstName},\nWe noticed your item,  ${currentProduct.text.name}, still hasn't sold. We suggest lowering it to £${Math.floor(suggestedDiscount*currentProduct.text.price)} in order to have a better chance of selling your item.`;
                            if(isFirstTime) {
                                
                                var notificationPostData = {
                                    name: currentProduct.text.name,
                                    brand: currentProduct.text.brand,
                                    price: currentProduct.text.price, //the selling price the user agreed to post this item for
                                    uri: currentProduct.uris.thumbnail[0],
                                    daysElapsed: daysElapsed,
                                    message: message,
                                    // message: `Nobody has initiated a chat about, ${currentProduct.text.name} from ${currentProduct.text.brand} yet, since its submission on the market ${currentProduct.text.daysElapsed} days ago 🤔. Consider a price reduction from £${currentProduct.text.price} \u2192 £${Math.floor(suggestedDiscount*currentProduct.text.price)}?`,

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
                                priceReductionNotificationUpdate[currentNotificationRef + '/message'] = message;
                                priceReductionNotificationUpdate[currentNotificationRef + '/uid'] = uid;
                                priceReductionNotificationUpdate[currentNotificationRef + '/key'] = key;
                                priceReductionNotificationUpdate[currentNotificationRef + '/selected'] = false;
                            }


                            // console.log(notificationPostData);
                            
                            admin.database().ref().update(priceReductionNotificationUpdate)

                        }

                        // console.log("The current index and product identifier is: " + i, postData.key);    
                        console.log("The current Uris obj is: " + currentProduct.uris);
                        console.log(currentProduct);    

                        postData = {
                            key: key, uid: uid, 
                            location: userCountry,
                            uris: {source: currentProduct.uris.source, thumbnail: currentProduct.uris.thumbnail, pd: currentProduct.uris.pd}, 
                            //TODO: below is why uris gets tacked on as extra property
                            text: currentProduct.text, daysElapsed: daysElapsed, 
                            //set property right now to easen burden on notification scheduling chain
                            shouldReducePrice: shouldReducePrice ? true : false,
                        }

                        
                        
                        
                        updates = {};

                        // updates['/Products/' + i + '/'] = postData;
                        updates['/Products/' + key + '/'] = postData;
                        // updates['/Products/' + userCountry +  + key + '/'] = postData;
                        admin.database().ref().update(updates);
                    }

                    else {
                        //TODO: Delete product without interrupting this upload flow.
                        console.log('skipping product as it does not have URIs')
                    }
                    
                    
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

//TODO: this chain does not work
exports.updateAppUsage = functions.database.ref('Users/{uid}/profile/status').onWrite((snapshot, context) => {
    if(snapshot.after.val() === "online") {
        let {uid} = context.params;
        admin.database().ref(`/Users/${uid}/appUsage/`).once("value", (dataFromReference) => {
            var currentCount = dataFromReference.val();
            let updates = {};
            updates[`/Users/${context.params.uid}/appUsage/`] = currentCount + 1;
            firebase.database().ref().update(updates);
        })
    }

    else {
        return null
    }
})


// exports.storePicturesOnDatabase = functions.storage.object().onFinalize(
//     (object) => {
//         // console.log("filePath is: " + object.name);
//         const name = object.selfLink.replace(`https://www.googleapis.com/storage/v1/b/${object.bucket}/o/`,'');
//         var productInformationURL = `https://firebasestorage.googleapis.com/v0/b/${object.bucket}/o/${name}?alt=media&token=${object.metadata.firebaseStorageDownloadTokens}`.replace(`https://firebasestorage.googleapis.com/v0/b/${object.bucket}/o/Users`, '')
//         productInformationURL = productInformationURL.replace(`?alt=media&token=${object.metadata.firebaseStorageDownloadTokens}`, '')
//         var strings = productInformationURL.split('%2F');
//         var uid = strings[1], productKey = strings[2], imageName = strings[3];
//         var updates = {};
//         const bucket = admin.storage().bucket();
//         const file = bucket.file(object.name);
      
//         const options = {
//           action: 'read',
//           expires: '03-17-2025'
//         };  file.getSignedUrl
      
//         // Get a signed URL for the file
//         file.getSignedUrl(options).then(results => {
//             var downloadURL = results[0];
//             if(strings.length === 4) {
//                 var type, index;
//                 console.log(imageName);
//                 if(imageName === '0') {
//                     type = 'source'
//                     index = 0
//                 }
        
//                 else if(imageName === '0-pd') {
//                     type = 'pd'
//                     index = 0
//                 }
        
//                 else if(imageName === '0-thumbnail') {
//                     type = 'pd'
//                     index = 0
//                 }
        
//                 else if(imageName === '1') {
//                     type = 'source'
//                     index = 1
//                 }
        
//                 else if(imageName === '1-pd') {
//                     type = 'pd'
//                     index = 1
//                 }
        
//                 else if(imageName === '1-thumbnail') {
//                     type = 'thumbnail'
//                     index = 1
//                 }
        
//                 else if(imageName === '2') {
//                     type = 'source'
//                     index = 2
//                 }
        
//                 else if(imageName === '2-pd') {
//                     type = 'pd'
//                     index = 2
//                 }
        
//                 else if(imageName === '2-thumbnail') {
//                     type = 'thumbnail'
//                     index = 2
//                 }
        
//                 else if(imageName === '3') {
//                     type = 'source'
//                     index = 3
//                 }
        
//                 else if(imageName === '3-pd') {
//                     type = 'pd'
//                     index = 3
//                 }
        
//                 else if(imageName === '3-thumbnail') {
//                     type = 'thumbnail'
//                     index = 3
//                 }
        
//                 updates['/Users/' + uid + '/products/' + productKey + '/uris/' + type + '/' + index + '/'] = downloadURL;
//                 admin.database().ref().update(updates);
//             }
    
//             else {
//                 console.log('Doing nothing');
//                 // updates['/Users/' + uid + '/profile/uri/'] = downloadURL
//             }
            
//             return null;
//           })
//           .catch(err => {
//               console.log(err)
//           })
      
        

        
        
//         // return null

// });

//correct download URL

// https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FLJ5iio1mhoQRoN0cZfGLPwrYp2B3%2F-LlJhrKxjt91ZjL3K8m8%2F2-pd?alt=media&token=00223a56-28ae-4690-ad67-274ebbe03eb0
// "https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FLJ5iio1mhoQRoN0cZfGLPwrYp2B3%2F-LlJhrKxjt91ZjL3K8m8%2F2-pd?alt=media&token=1fc13585-2933-444d-9be7-f5eafcc5744f" 

// `https://firebasestorage.googleapis.com/v0/b/${object.bucket}/o/${object.selfLink.replace(`https://www.googleapis.com/storage/v1/b/${object.bucket}/o/`,'')}?alt=media&token=${object.metadata.firebaseStorageDownloadTokens}`
// https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FLJ5iio1mhoQRoN0cZfGLPwrYp2B3%2FScreenshot%202019-07-23%20at%2012.23.12%20AM.png?alt=media&token=5a931d52-d936-4176-8573-7afababad4dd
// https://www.googleapis.com/storage/v1/b/nottmystyle-447aa.appspot.com/o/Users%2FLJ5iio1mhoQRoN0cZfGLPwrYp2B3%2FScreenshot%202019-07-23%20at%2012.23.12%20AM.png
// nottmystyle-447aa.appspot.com/Users/LJ5iio1mhoQRoN0cZfGLPwrYp2B3/Screenshot 2019-07-23 at 12.23.12 AM.png/1564775567012046

// https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FLJ5iio1mhoQRoN0cZfGLPwrYp2B3%2F-LlImKBRAWxbgWiZkOrJ%2F0?alt=media&token=7b9ac507-955e-467d-b678-19f87b6781b9
// exports.generateThumbnail = functions.storage.object().onFinalize(async (object) => {
//     // ...
//   });

exports.sendPriceReductionNotifications = functions.database.ref('Users/{uid}/notifications/priceReductions/{notification}').onWrite((snapshot, context) => {

    var rawData = snapshot.after.val(); 
    if(rawData.unreadCount === true) {
        admin.database().ref(`Users/${context.params.uid}/pushToken`).once("value", (dataFromReference) => {
        
            var {name, message} = rawData;
            var token = dataFromReference.val();
            console.log(token);
            const payload = {
                notification: {
                 title: `Reduce Price of ${name}`,
                 body: message
                }
            };
            
            admin.messaging().sendToDevice(token,payload)
            .then((response) => {
              // Response is a message ID string.
              console.log('Successfully sent message:', response);
              return null
            })
            .catch((error) => {
              console.log('Error sending message:', error);
            });

            return null
        })
    }
    return null
    
})

// exports.sendNoobNotification = 

// exports.sendProductAcquisitionNotifications = functions.database.ref('Users/{uid}/notifications/itemsSold/{notification}').onWrite((snapshot, context) => {
//     admin.database().ref(`Users/${context.params.uid}/pushToken`).once("value", (dataFromReference) => {
//         var rawData = snapshot.after.val(); 
//         var {name, price, buyerName} = rawData;
//         var token = dataFromReference.val();
//         console.log(token);
//         const payload = {
//             notification: {
//              title: 'Item Sold!',
//              body: `Congratulations, your item ${name} has been purchased by ${buyerName} for £${price}. Use the in-app notifications to indicate when you have shipped the item. Once the buyer confirms they have received the item, we shall transfer your funds.`
//             }
//         };
//         // var message = {
//         //     data: {
//         //         score: '850',
//         //         time: '2:45'
//         //     },
//         //     token: token
//         // };
//         admin.messaging().sendToDevice(token,payload)
//         .then((response) => {
//           // Response is a message ID string.
//           console.log('Successfully sent message:', response);
//           return null
//         })
//         .catch((error) => {
//           console.log('Error sending message:', error);
//         });

//         return null
//     })
//     return null
// })

// exports.sendProductPurchaseNotifications = functions.database.ref('Users/{uid}/notifications/purchaseReceipts/{notification}').onWrite((snapshot, context) => {
    
//     admin.database().ref(`Users/${context.params.uid}/pushToken`).once("value", (dataFromReference) => {
//         var rawData = snapshot.after.val(); 
//         var {name, sellerName, postOrNah} = rawData;
//         var token = dataFromReference.val(); 
//         const payload = {
//             notification: {
//              title: 'Purchase Receipt!',
//             //  body: "Nice job, you've managed"
//              body: postOrNah === 'post' ? `Your product: ${name} is being posted over by ${sellerName}. Please contact us at nottmystyle.help@gmail.com if it does not arrive within 2 weeks.` : `Please get in touch with ${sellerName} regarding your acquisition of their ${name}.`
//             }
//         };
//         // var message = {
//         //     data: {
//         //         score: '850',
//         //         time: '2:45'
//         //     },
//         //     token: token
//         // };
//         admin.messaging().sendToDevice(token,payload)
//         .then((response) => {
//           // Response is a message ID string.
//           console.log('Successfully sent message:', response);
//           return null
//         })
//         .catch((error) => {
//           console.log('Error sending message:', error);
//         });

//         return null
//     })

//     return null
// })

exports.updateOrders = functions.database.ref('Users/{uid}/notifications/itemsSold/{notification}').onWrite((snapshot, context)=>{
    var notificationData = snapshot.after.val();
    var productId = context.params.notification;
    console.log(productId);
    var {buyerId, sellerId, buyerName, sellerName, uri, deliveryStatus} = notificationData;
    admin.database().ref('/Users/').once('value', (dataFromReference) => {
        var Users = dataFromReference.val();
        // Users = Users.val();
        // let productId = Object.entries(Users[sellerId].notifications.itemsSold).find((entry) => {
        //     return entry[1] = notificationData;
        // });
        //TODO: undefined query
        let productData = Users[sellerId].products[productId].text;
        console.log(Users[sellerId]);
        console.log(Users[sellerId].products);
        console.log(Users[sellerId].products);
        let {price, post_price, name} = productData;
        // console.log(notificationData);
        let promiseOne = admin.auth().getUser(buyerId);
        let promiseTwo = admin.auth().getUser(sellerId);

        Promise.all([promiseOne,promiseTwo])
        .then((data)=> {
            var buyerEmail = data[0].email;
            var sellerEmail = data[1].email;
            var postData = {
                buyerName,
                buyerEmail,
                sellerName,
                sellerEmail,
                uri,
                deliveryStatus,
                productId,
                productName: name, 
                productPrice: price,
                productPostPrice: post_price,
            }
            var updates = {};
            updates['/Orders/' + productId + '/'] = postData;
            admin.database().ref().update(updates);

            return null
        })
        .catch(err => {
    
            console.log(err);
            return null
        })
            
    })
    
    // buyerRecord = await ;
    // sellerRecord = await ;
})

//Function Numbah 8:
//Delete a product from Products/ once it is deleted from Users/Products/Key
//Not necessary since permanent product deletion is handled from client side, 
//TODO: delete chatRoom that the product was associated with AND delete in cloud image storage
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