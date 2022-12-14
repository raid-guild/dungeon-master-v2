const useUpdateCreate = () => {
  console.log('useUpdateCreate');
};

// if ('update' in result) {
//   toast({
//     title: 'Raid Updated',
//     description: 'Your update has been recorded.',
//     status: 'success',
//     duration: 3000,
//     isClosable: true,
//   });
//   setAddupdate(false);
//   // TODO update update feed inline
//   // router.push(`/raids/[id]`, `/raids/${raidId}`);
//   updateRaid('updates', [
//     ...updates,
//     {
//       ...result,
//       createdAt: new Date(result.createdAt),
//       updateedBy: userData.member,
//     },
//   ]);
// }

export default useUpdateCreate;
