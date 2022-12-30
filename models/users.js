'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
        Users.hasMany(models.Agent,{foreignKey:'created_by'})
        Users.belongsToMany(models.Roles, {through: models.UserRoles, foreignKey: 'user_id', otherKey: 'role_id'});
        Users.hasOne(models.RefreshToken, {foreignKey:'user_id'})
        Users.belongsToMany(models.Company,{
            through: models.UserCompany,
            foreignKey:'user_id',
            otherKey:'company_id'
        })

        Users.belongsToMany(models.Property,{
            through: models.PropertyOwner,
            foreignKey: 'owner_id',
            otherKey: 'property_id'
        })

        Users.belongsToMany(models.LandOwner, {
            through: models.UserOwner,
            foreignKey: 'user_id',
            otherKey: 'owner_id'
        });

        Users.belongsToMany(models.Agent,{
            through: models.UserAgent,
            foreignKey:'user_id',
            otherKey:'agent_id'
        })

        Users.belongsToMany(models.Tenant,{
            through: models.UserTenant,
            foreignKey:'user_id',
            otherKey:'tenant_id'
        })
        Users.hasMany(models.ProfilePicture,{foreignKey:'user_id'})
    }
  }
  Users.init({
     id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
     },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email_address: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    username: DataTypes.STRING,
    description: DataTypes.STRING(1000),
    password: DataTypes.STRING,
    IsActive: DataTypes.BOOLEAN,
    IsDeleted: DataTypes.BOOLEAN,
    createdBy: DataTypes.UUID,
    IsApproved: DataTypes.BOOLEAN,
    ApprovedBy: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Users',

    hooks: {
        beforeCreate: function (user, options) {
            if (user?.password) {
                user.password = bcrypt.hashSync(user?.password || '$2b$10$qFukkvggfgfzdLCBgqKxseRWNxEQ8wjlNix2w7xJqpmSDu9vHvb6G', bcrypt?.genSaltSync(10));
            }
        },
        afterCreate: function (user, options) {
            if(user.Roles == null){
                user.getRoles().then(roles=>{
                    if(roles == null || roles.length === 0){
                        return this.sequelize.models.Roles.findOrCreate({
                            where: {'name':'SYSTEM_ADMIN'},
                            defaults:{description:'For highest level system admin'}
                        }).then((role,created)=>{
                            new this.sequelize.models.UserRoles({
                                user_id: user.id,
                                role_id: role[0].id
                            }).save().then((ur)=>{
                                console.log('Attached to SYSTEM_ADMIN')
                            }).catch(err=>{
                                console.log(err);
                            })
                        }).catch((err)=>{
                            console.log(err)
                        })
                    }
                })
            }
        },
    }
  });

    Users.beforeBulkUpdate( (user) => {
        user.attributes.updateTime = new Date();
        return user;
    })

    Users.beforeCreate((user)=>{
        //console.log(user);
        return user;
    });

    Users.afterCreate((user)=>{
        return user;
    });
    Users.prototype.isAdminAsync = async function(){
        return this.roles !== null && this.roles.some(role=>role.name === 'ROLE_ADMIN')
    };
    Users.prototype.isAdminAsync = async function () {
        let isAdmin = false;
        await this.getRoles().then(roles => {
            isAdmin = roles.some(r => r.name === 'ROLE_ADMIN');
        }).catch(err => {
            console.error(err);
        });

        return isAdmin;
    };

    Users.prototype.isValidPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };

    Users.prototype.generateJwt = function () {
        return jwt.sign(
            {
                userId: this.id,
                username: this.get('username'),
                roles: this.Roles.map(role => role.id)
            },
            process.env.JWT_KEY || 'JWT_SUPER_SECRET',
            {expiresIn: process.env.EXPIRE_TIME || 360000}
        );
    };

    // Users.prototype.generateRefreshToken = function () {
    //     return jwt.sign(
    //         {
    //             userId: this.id,
    //             username: this.get('username'),
    //             roles: this.Roles.map(role => role.name)
    //         },
    //         process.env.REFRESH_JWT_KEY || 'REFRESH_JWT_SECRET',
    //         {expiresIn: '1d'}
    //     )
    // }

    return Users;
};
