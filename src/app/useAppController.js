import { useEffect, useState } from 'react';
import { themeColors } from './theme';
import { getCurrentUser, loginRequest } from '../services/api/authApi';
import { fetchDashboardStats } from '../services/api/dashboardApi';
import { fetchFatwas, removeFatwa, submitFatwa, updateFatwa } from '../services/api/fatwaApi';
import { createUser, fetchUsers, removeUser, updateUser } from '../services/api/userApi';
// ابحث عن هذا السطر في الأعلى وضف updateCategory
import { fetchCategories, createCategory, removeCategory, updateCategory } from '../services/api/categoryApi';
import { getStoredToken, setStoredToken } from '../services/api/client';

export function useAppController() {
  const [darkMode, setDarkMode] = useState(false);
  const [fatwas, setFatwas] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]); // تم إضافة الـ state الخاص بالتصنيفات
  const [currentUser, setCurrentUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [loadingFatwas, setLoadingFatwas] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);

  // إدارة الوضع الليلي
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // تحميل الخطوط
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Reem+Kufi:wght@400;500;600;700&family=Tajawal:wght@300;400;500;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // دالة تحديث التصنيفات
  const refreshCategories = async () => {
    try {
      const data = await fetchCategories();
      const cats = data.categories || [];
      setCategories(cats);
      return cats;
    } catch (error) {
      console.error("Error refreshing categories:", error);
      return [];
    }
  };

  // الإقلاع الأولي للتطبيق (Bootstrap)
  useEffect(() => {
    async function bootstrap() {
      const token = getStoredToken();
      try {
        if (token) {
          // جلب كل البيانات المطلوبة للمسؤول (Admin)
          const [{ user }, fatwaResponse, userResponse, dashboardResponse, cats] = await Promise.all([
            getCurrentUser(token),
            fetchFatwas({ admin: true }),
            fetchUsers(),
            fetchDashboardStats(),
            refreshCategories(),
          ]);
          
          setCurrentUser(user);
          setFatwas(fatwaResponse.fatwas);
          setUsers(userResponse.users);
          setDashboardStats({
            stats: dashboardResponse.stats,
            latestFatwas: dashboardResponse.latestFatwas,
          });
        } else {
          // جلب البيانات العامة للزوار
          const [{ fatwas: publicFatwas }] = await Promise.all([
            fetchFatwas(),
            refreshCategories(),
          ]);
          setFatwas(publicFatwas);
        }
      } catch (error) {
        setStoredToken(null);
        setCurrentUser(null);
        const { fatwas: publicFatwas } = await fetchFatwas();
        setFatwas(publicFatwas);
      } finally {
        setLoadingFatwas(false);
        setAuthReady(true);
      }
    }
    bootstrap();
  }, []);

  // --- دوال إدارة التصنيفات ---
  const saveCategoryRecord = async (targetId, payload) => {
  try {
    if (targetId === 'new') {
      // حالة الإضافة
      await createCategory(payload);
    } else {
      // حالة التعديل - الآن ستعمل لأننا أضفنا الدالة والشرط
      await updateCategory(targetId, payload);
    }
    // تحديث القائمة في الواجهة بعد الحفظ
    await refreshCategories();
  } catch (error) {
    console.error("Error saving category:", error);
    throw error; // نمرر الخطأ لتظهره صفحة الـ UI (الـ Toast)
  }
};

  const deleteCategoryById = async (id) => {
    await removeCategory(id);
    await refreshCategories();
  };

  // --- دوال التحديث العامة ---
  const refreshFatwas = async (adminView = Boolean(getStoredToken())) => {
    const { fatwas: nextFatwas } = await fetchFatwas({ admin: adminView });
    setFatwas(nextFatwas);
    if (adminView && getStoredToken()) {
      await refreshDashboardStats();
    }
    return nextFatwas;
  };

  const refreshUsers = async () => {
    const { users: nextUsers } = await fetchUsers();
    setUsers(nextUsers);
    return nextUsers;
  };

  const refreshDashboardStats = async () => {
    const dashboardResponse = await fetchDashboardStats();
    setDashboardStats({
      stats: dashboardResponse.stats,
      latestFatwas: dashboardResponse.latestFatwas,
    });
    return dashboardResponse;
  };

  // --- إدارة الحساب (Login/Logout) ---
  const login = async (credentials) => {
    const { token, user } = await loginRequest(credentials);
    setStoredToken(token);
    setCurrentUser(user);
    const [{ fatwas: nextFatwas }, { users: nextUsers }, dashboardResponse] = await Promise.all([
      fetchFatwas({ admin: true }),
      fetchUsers(),
      fetchDashboardStats(),
      refreshCategories(),
    ]);
    setFatwas(nextFatwas);
    setUsers(nextUsers);
    setDashboardStats({
      stats: dashboardResponse.stats,
      latestFatwas: dashboardResponse.latestFatwas,
    });
    return user;
  };

  const logout = async () => {
    setStoredToken(null);
    setCurrentUser(null);
    setUsers([]);
    setDashboardStats(null);
    await refreshFatwas(false);
  };

  // --- إدارة الفتاوى والمستخدمين ---
  const createFatwa = async (payload) => {
    const result = await submitFatwa(payload);
    await refreshFatwas(false);
    setShowSuccessModal(true);
    return result;
  };

  const saveFatwaReply = async (fatwaId, payload) => {
    const result = await updateFatwa(fatwaId, payload);
    await refreshFatwas(true);
    return result;
  };

  const deleteFatwaById = async (fatwaId) => {
    await removeFatwa(fatwaId);
    await refreshFatwas(true);
  };

  const saveUserRecord = async (selectedUser, payload) => {
    if (selectedUser === 'new') {
      await createUser(payload);
    } else {
      const result = await updateUser(selectedUser.id, payload);
      if (currentUser?.id === selectedUser.id) {
        setCurrentUser(result.user);
      }
    }
    await refreshUsers();
  };

  const deleteUserById = async (userId) => {
    await removeUser(userId);
    await refreshUsers();
  };

  return {
    authReady,
    currentUser,
    createFatwa,
    dashboardStats,
    deleteFatwaById,
    deleteUserById,
    darkMode,
    fatwas,
    categories, // تم تصدير التصنيفات
    isMenuOpen,
    login,
    loadingFatwas,
    logout,
    refreshDashboardStats,
    refreshFatwas,
    refreshUsers,
    refreshCategories, // تم تصدير دالة التحديث
    saveFatwaReply,
    saveUserRecord,
    saveCategoryRecord, // تم تصدير دالة الحفظ
    deleteCategoryById, // تم تصدير دالة الحذف
    setCurrentUser,
    setDarkMode,
    setFatwas,
    setIsMenuOpen,
    setShowSuccessModal,
    setUsers,
    showSuccessModal,
    themeColors,
    users,
  };
}
// import { useEffect, useState } from 'react';
// import { themeColors } from './theme';
// import { getCurrentUser, loginRequest } from '../services/api/authApi';
// import { fetchDashboardStats } from '../services/api/dashboardApi';
// import { fetchFatwas, removeFatwa, submitFatwa, updateFatwa } from '../services/api/fatwaApi';
// import { createUser, fetchUsers, removeUser, updateUser } from '../services/api/userApi';
// // --- المحطة الثانية: الاستيراد ---
// import { fetchCategories, createCategory, removeCategory } from '../services/api/categoryApi';
// import { getStoredToken, setStoredToken } from '../services/api/client';

// export function useAppController() {
//   const [darkMode, setDarkMode] = useState(false);
//   const [fatwas, setFatwas] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [authReady, setAuthReady] = useState(false);
//   const [loadingFatwas, setLoadingFatwas] = useState(true);
//   const [dashboardStats, setDashboardStats] = useState(null);
  
//   // --- إضافة الـ State الخاص بالتصنيفات ---
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   }, [darkMode]);

//   useEffect(() => {
//     const link = document.createElement('link');
//     link.href =
//       'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Reem+Kufi:wght@400;500;600;700&family=Tajawal:wght@300;400;500;700;800&display=swap';
//     link.rel = 'stylesheet';
//     document.head.appendChild(link);
//     return () => {
//       document.head.removeChild(link);
//     };
//   }, []);

//   useEffect(() => {
//     async function bootstrap() {
//       const token = getStoredToken();

//       try {
//         if (token) {
//           const [{ user }, fatwaResponse, userResponse, dashboardResponse] = await Promise.all([
//             getCurrentUser(token),
//             fetchFatwas({ admin: true }),
//             fetchUsers(),
//             fetchDashboardStats(),
//             refreshCategories(), // --- إضافة استدعاء التصنيفات هنا ---
//           ]);
//           setCurrentUser(user);
//           setFatwas(fatwaResponse.fatwas);
//           setUsers(userResponse.users);
//           setDashboardStats({
//             stats: dashboardResponse.stats,
//             latestFatwas: dashboardResponse.latestFatwas,
//           });
//         } else {
//           const [{ fatwas: publicFatwas }] = await Promise.all([
//             fetchFatwas(),
//             refreshCategories(), // جلب التصنيفات حتى للزوار إذا لزم الأمر
//           ]);
//           setFatwas(publicFatwas);
//         }
//       } catch (error) {
//         setStoredToken(null);
//         setCurrentUser(null);
//         const { fatwas: publicFatwas } = await fetchFatwas();
//         setFatwas(publicFatwas);
//       } finally {
//         setLoadingFatwas(false);
//         setAuthReady(true);
//       }
//     }

//     bootstrap();
//   }, []);

//   // --- دوال إدارة التصنيفات المضافة ---
//   const refreshCategories = async () => {
//     try {
//       const data = await fetchCategories();
//       setCategories(data.categories || []);
//       return data.categories;
//     } catch (error) {
//       console.error("Error refreshing categories:", error);
//       return [];
//     }
//   };

//   const saveCategoryRecord = async (selectedCat, payload) => {
//     if (selectedCat === 'new') {
//       await createCategory(payload);
//     } else {
//       // يمكنك إضافة تحديث هنا مستقبلاً إذا أضفت Update Route في الباك إند
//     }
//     await refreshCategories();
//   };

//   const deleteCategoryById = async (id) => {
//     await removeCategory(id);
//     await refreshCategories();
//   };
//   // --------------------------------

//   const refreshFatwas = async (adminView = Boolean(getStoredToken())) => {
//     const { fatwas: nextFatwas } = await fetchFatwas({ admin: adminView });
//     setFatwas(nextFatwas);

//     if (adminView && getStoredToken()) {
//       const dashboardResponse = await fetchDashboardStats();
//       setDashboardStats({
//         stats: dashboardResponse.stats,
//         latestFatwas: dashboardResponse.latestFatwas,
//       });
//     }

//     return nextFatwas;
//   };

//   const refreshUsers = async () => {
//     const { users: nextUsers } = await fetchUsers();
//     setUsers(nextUsers);
//     return nextUsers;
//   };

//   const refreshDashboardStats = async () => {
//     const dashboardResponse = await fetchDashboardStats();
//     setDashboardStats({
//       stats: dashboardResponse.stats,
//       latestFatwas: dashboardResponse.latestFatwas,
//     });
//     return dashboardResponse;
//   };

//   const login = async (credentials) => {
//     const { token, user } = await loginRequest(credentials);
//     setStoredToken(token);
//     setCurrentUser(user);
//     const [{ fatwas: nextFatwas }, { users: nextUsers }, dashboardResponse] = await Promise.all([
//       fetchFatwas({ admin: true }),
//       fetchUsers(),
//       fetchDashboardStats(),
//       refreshCategories(), // جلب التصنيفات بعد الدخول
//     ]);
//     setFatwas(nextFatwas);
//     setUsers(nextUsers);
//     setDashboardStats({
//       stats: dashboardResponse.stats,
//       latestFatwas: dashboardResponse.latestFatwas,
//     });
//     return user;
//   };

//   const logout = async () => {
//     setStoredToken(null);
//     setCurrentUser(null);
//     setUsers([]);
//     setDashboardStats(null);
//     await refreshFatwas(false);
//   };

//   const createFatwa = async (payload) => {
//     const result = await submitFatwa(payload);
//     await refreshFatwas(false);
//     setShowSuccessModal(true);
//     return result;
//   };

//   const saveFatwaReply = async (fatwaId, payload) => {
//     const result = await updateFatwa(fatwaId, payload);
//     await refreshFatwas(true);
//     return result;
//   };

//   const deleteFatwaById = async (fatwaId) => {
//     await removeFatwa(fatwaId);
//     await refreshFatwas(true);
//   };

//   const saveUserRecord = async (selectedUser, payload) => {
//     if (selectedUser === 'new') {
//       await createUser(payload);
//     } else {
//       const result = await updateUser(selectedUser.id, payload);
//       if (currentUser?.id === selectedUser.id) {
//         setCurrentUser(result.user);
//       }
//     }

//     await refreshUsers();
//   };

//   const deleteUserById = async (userId) => {
//     await removeUser(userId);
//     await refreshUsers();
//   };

//   return {
//     authReady,
//     currentUser,
//     createFatwa,
//     dashboardStats,
//     deleteFatwaById,
//     deleteUserById,
//     darkMode,
//     fatwas,
//     isMenuOpen,
//     login,
//     loadingFatwas,
//     logout,
//     refreshDashboardStats,
//     refreshFatwas,
//     refreshUsers,
//     saveFatwaReply,
//     saveUserRecord,
//     setCurrentUser,
//     setDarkMode,
//     setFatwas,
//     setIsMenuOpen,
//     setShowSuccessModal,
//     setUsers,
//     showSuccessModal,
//     themeColors,
//     users,
//     // --- المحطة الرابعة: التصدير ---
//     categories,
//     saveCategoryRecord,
//     deleteCategoryById,
//     refreshCategories,
//   };
// }
// // import { useEffect, useState } from 'react';
// // import { themeColors } from './theme';
// // import { getCurrentUser, loginRequest } from '../services/api/authApi';
// // import { fetchDashboardStats } from '../services/api/dashboardApi';
// // import { fetchFatwas, removeFatwa, submitFatwa, updateFatwa } from '../services/api/fatwaApi';
// // import { createUser, fetchUsers, removeUser, updateUser } from '../services/api/userApi';
// // import { getStoredToken, setStoredToken } from '../services/api/client';

// // export function useAppController() {
// //   const [darkMode, setDarkMode] = useState(false);
// //   const [fatwas, setFatwas] = useState([]);
// //   const [users, setUsers] = useState([]);
// //   const [currentUser, setCurrentUser] = useState(null);
// //   const [isMenuOpen, setIsMenuOpen] = useState(false);
// //   const [showSuccessModal, setShowSuccessModal] = useState(false);
// //   const [authReady, setAuthReady] = useState(false);
// //   const [loadingFatwas, setLoadingFatwas] = useState(true);
// //   const [dashboardStats, setDashboardStats] = useState(null);

// //   useEffect(() => {
// //     if (darkMode) {
// //       document.documentElement.classList.add('dark');
// //     } else {
// //       document.documentElement.classList.remove('dark');
// //     }
// //   }, [darkMode]);

// //   useEffect(() => {
// //     const link = document.createElement('link');
// //     link.href =
// //       'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Reem+Kufi:wght@400;500;600;700&family=Tajawal:wght@300;400;500;700;800&display=swap';
// //     link.rel = 'stylesheet';
// //     document.head.appendChild(link);
// //     return () => {
// //       document.head.removeChild(link);
// //     };
// //   }, []);

// //   useEffect(() => {
// //     async function bootstrap() {
// //       const token = getStoredToken();

// //       try {
// //         if (token) {
// //           const [{ user }, fatwaResponse, userResponse, dashboardResponse] = await Promise.all([
// //             getCurrentUser(token),
// //             fetchFatwas({ admin: true }),
// //             fetchUsers(),
// //             fetchDashboardStats(),
// //           ]);
// //           setCurrentUser(user);
// //           setFatwas(fatwaResponse.fatwas);
// //           setUsers(userResponse.users);
// //           setDashboardStats({
// //             stats: dashboardResponse.stats,
// //             latestFatwas: dashboardResponse.latestFatwas,
// //           });
// //         } else {
// //           const { fatwas: publicFatwas } = await fetchFatwas();
// //           setFatwas(publicFatwas);
// //         }
// //       } catch (error) {
// //         setStoredToken(null);
// //         setCurrentUser(null);
// //         const { fatwas: publicFatwas } = await fetchFatwas();
// //         setFatwas(publicFatwas);
// //       } finally {
// //         setLoadingFatwas(false);
// //         setAuthReady(true);
// //       }
// //     }

// //     bootstrap();
// //   }, []);

// //   const refreshFatwas = async (adminView = Boolean(getStoredToken())) => {
// //     const { fatwas: nextFatwas } = await fetchFatwas({ admin: adminView });
// //     setFatwas(nextFatwas);

// //     if (adminView && getStoredToken()) {
// //       const dashboardResponse = await fetchDashboardStats();
// //       setDashboardStats({
// //         stats: dashboardResponse.stats,
// //         latestFatwas: dashboardResponse.latestFatwas,
// //       });
// //     }

// //     return nextFatwas;
// //   };

// //   const refreshUsers = async () => {
// //     const { users: nextUsers } = await fetchUsers();
// //     setUsers(nextUsers);
// //     return nextUsers;
// //   };

// //   const refreshDashboardStats = async () => {
// //     const dashboardResponse = await fetchDashboardStats();
// //     setDashboardStats({
// //       stats: dashboardResponse.stats,
// //       latestFatwas: dashboardResponse.latestFatwas,
// //     });
// //     return dashboardResponse;
// //   };

// //   const login = async (credentials) => {
// //     const { token, user } = await loginRequest(credentials);
// //     setStoredToken(token);
// //     setCurrentUser(user);
// //     const [{ fatwas: nextFatwas }, { users: nextUsers }, dashboardResponse] = await Promise.all([
// //       fetchFatwas({ admin: true }),
// //       fetchUsers(),
// //       fetchDashboardStats(),
// //     ]);
// //     setFatwas(nextFatwas);
// //     setUsers(nextUsers);
// //     setDashboardStats({
// //       stats: dashboardResponse.stats,
// //       latestFatwas: dashboardResponse.latestFatwas,
// //     });
// //     return user;
// //   };

// //   const logout = async () => {
// //     setStoredToken(null);
// //     setCurrentUser(null);
// //     setUsers([]);
// //     setDashboardStats(null);
// //     await refreshFatwas(false);
// //   };

// //   const createFatwa = async (payload) => {
// //     const result = await submitFatwa(payload);
// //     await refreshFatwas(false);
// //     setShowSuccessModal(true);
// //     return result;
// //   };

// //   const saveFatwaReply = async (fatwaId, payload) => {
// //     const result = await updateFatwa(fatwaId, payload);
// //     await refreshFatwas(true);
// //     return result;
// //   };

// //   const deleteFatwaById = async (fatwaId) => {
// //     await removeFatwa(fatwaId);
// //     await refreshFatwas(true);
// //   };

// //   const saveUserRecord = async (selectedUser, payload) => {
// //     if (selectedUser === 'new') {
// //       await createUser(payload);
// //     } else {
// //       const result = await updateUser(selectedUser.id, payload);
// //       if (currentUser?.id === selectedUser.id) {
// //         setCurrentUser(result.user);
// //       }
// //     }

// //     await refreshUsers();
// //   };

// //   const deleteUserById = async (userId) => {
// //     await removeUser(userId);
// //     await refreshUsers();
// //   };

// //   return {
// //     authReady,
// //     currentUser,
// //     createFatwa,
// //     dashboardStats,
// //     deleteFatwaById,
// //     deleteUserById,
// //     darkMode,
// //     fatwas,
// //     isMenuOpen,
// //     login,
// //     loadingFatwas,
// //     logout,
// //     refreshDashboardStats,
// //     refreshFatwas,
// //     refreshUsers,
// //     saveFatwaReply,
// //     saveUserRecord,
// //     setCurrentUser,
// //     setDarkMode,
// //     setFatwas,
// //     setIsMenuOpen,
// //     setShowSuccessModal,
// //     setUsers,
// //     showSuccessModal,
// //     themeColors,
// //     users,
// //   };
// // }
