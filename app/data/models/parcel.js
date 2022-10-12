module.exports = (sequelize, DataTypes) => {
  const parcel = sequelize.define('parcel', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: true,
      defaultValue: sequelize.UUIDV4
    },
    reference: DataTypes.STRING,
    sbi: DataTypes.STRING,
    data: DataTypes.JSONB,
    createdAt: { type: DataTypes.DATE, defaultValue: Date.now() },
    updatedAt: { type: DataTypes.DATE, defaultValue: null }
  }, {
    freezeTableName: true,
    tableName: 'parcel'
  })
  return parcel
}
