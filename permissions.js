const createResolver = (resolver) => {
  const baseResolver = resolver;
  baseResolver.createResolver = (childResolver) => {
    const newResolver = async (parent, args, context, info) => {
      await resolver(parent, args, context, info);
      return childResolver(parent, args, context, info);
    };
    return createResolver(newResolver);
  };
  return baseResolver;
};

// requiresAuth
export default createResolver((parent, args, { user , isAdmin, isTeacher}) => {
  console.log('=========requiresAuth', user, isAdmin, isTeacher);
  if (!user) {
    throw new Error('Not authenticated');
  }
});

export const requiresAdmin = createResolver(async (parent, args, {user, isAdmin}) => {
  console.log('=========requiresAdmin');
  if (!user) {
    throw new Error('Not authenticated');
  }
  if (!isAdmin) {
    throw new Error('Not admin');
  }
});

export const requiresTeacher = createResolver(async (parent, args, {user, isTeacher}) => {
  console.log('=========requiresTeacher');
  console.log('requiresTeacher:',user, isTeacher);
  if (!user) {
    throw new Error('Not authenticated');
  }
  if (!isTeacher) {
    throw new Error('Not teacher');
  }
});
