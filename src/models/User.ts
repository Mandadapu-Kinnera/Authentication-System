import { DataTypes, Model, Sequelize } from 'sequelize';

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  theme_preference: 'light' | 'dark' | 'system';
  reset_token?: string;
  reset_token_expires?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface UserCreationAttributes extends Omit<UserAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: 'user' | 'admin';
  public theme_preference!: 'light' | 'dark' | 'system';
  public reset_token?: string;
  public reset_token_expires?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Add getter for compatibility with frontend
  public get isVerified(): boolean {
    return true; // Since your table doesn't have this field, we'll default to true
  }

  public get resetToken(): string | undefined {
    return this.reset_token;
  }

  public get resetTokenExpiry(): Date | undefined {
    return this.reset_token_expires;
  }

  public get createdAt(): Date {
    return this.created_at;
  }

  public get updatedAt(): Date {
    return this.updated_at;
  }
}

export const initUserModel = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 100],
        },
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [6, 255],
        },
      },
      role: {
        type: DataTypes.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user',
      },
      theme_preference: {
        type: DataTypes.ENUM('light', 'dark', 'system'),
        allowNull: false,
        defaultValue: 'system',
      },
      reset_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      reset_token_expires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          unique: true,
          fields: ['email'],
        },
        {
          fields: ['reset_token'],
        },
      ],
    }
  );

  return User;
};