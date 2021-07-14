const userModel = require('../database').models.user;

const create = function(data, callback) {
  const newUser = new userModel(data);
  newUser.save(callback);
};

const findOne = function(data, callback) {
  userModel.findOne(data, callback);
};

const findById = function(id, callback) {
  userModel.findById(id, callback);
};

const findOrCreate = function(data, callback){
  findOne({'socialId': data.id}, function(err, user){
    if(err) {
      return callback(err);
    } else{
      const userData = {
        username: data.displayName,
        socialId: data.id,
        picture: data.photos[0].value || null
      };
      // 200px x 200px의 프로필 사진을 요청
      if(data.provider == 'facebook' && userData.picture){
        userData.picture = "http://graph.facebook.com/" + data.id + "picture/?type=large"
      }

      create(userData, function(err, newUser){
        callback(err, newUser);
      });
    }
  });
}

const isAuthenticated = function (req, res, next) {
	if(req.isAuthenticated()){
		next();
	}else{
		res.redirect('/');
	}
}