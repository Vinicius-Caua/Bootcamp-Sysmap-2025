export const userType = (responseData: any) => ({
  id: responseData.id,
  name: responseData.name,
  email: responseData.email,
  cpf: responseData.cpf,
  avatar: responseData.avatar,
  xp: responseData.xp,
  level: responseData.level,
  achievements: responseData.achievements,
});

export const userPreferences = (responseData: any) => ({
  typeId: responseData.typeId,
  typeName: responseData.typeName,
  typeDescription: responseData.typeDescription,
});
