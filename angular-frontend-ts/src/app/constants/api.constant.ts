import { environment } from '../../environments/environment';

export const apiURL = environment.api_base_url;
export const api = {
  adminLogin: {
    url: `${apiURL}/login`,
    method: 'post'
  },
  clientLogin: {
    url: `${apiURL}/clients/login`,
    method: 'post'
  },
  clientIsPasswordSet: {
    url: `${apiURL}/clients/ispasswordset`,
    method: 'post'
  },
  clientForgot: {
    url: `${apiURL}/clients/forgot`,
    method: 'post'
  },
  resetPassword: {
    url: `${apiURL}/clients/resetpassword`,
    method: 'post'
  },
  changePassword: {
    url: `${apiURL}/clients/changePassword`,
    method: 'post'
  },
  clientLogout: {
    url: `${apiURL}/clients/logout`,
    method: 'get'
  },
  clientSignUp: {
    url: `${apiURL}/clients/signup`,
    method: 'post'
  },
  clientWatchTv: {
    url: `${apiURL}/clients/uscreen`,
    method: 'get'
  },
  socialLogin: {
    url: `${apiURL}/clients/sociallogin`,
    method: 'post'
  },
  paymentMethods: {
    url: `${apiURL}/clients/paymentmethods`,
    method: 'get'
  },
  createSetupIntent: {
    url: `${apiURL}/clients/setupintent`,
    method: 'get'
  },
  detachPaymentMethod: {
    url: `${apiURL}/clients/detach/paymentmethod`,
    method: 'post'
  },
  // Place Order
  createPlaceOrder: {
    url: `${apiURL}/placeorder`,
    method: 'post'
  },
  createConfirmOrder: {
    url: `${apiURL}/confirmorder`,
    method: 'post'
  },
  createConfirmSubscription: {
    url: `${apiURL}/confirmsubscription`,
    method: 'post'
  },
  getPaymentIntent: {
    url: `${apiURL}/paymentintent`,
    method: 'post'
  },
  // Subscription
  createSubscription: {
    url: `${apiURL}/subscription`,
    method: 'post'
  },
  cancelSubscription: {
    url: `${apiURL}/subscription/cancel/request`,
    method: 'post'
  },
  getSubscription: {
    url: `${apiURL}/subscription`,
    method: 'get'
  },
  clientStatus: {
    url: `${apiURL}/subscription/client/status`,
    method: 'get'
  },
  // Order
  getOrderTraking: (id: string) => {
    return {
      url: `${apiURL}/order/${id}`,
      method: 'get'
    };
  },
  getMyOrders: {
    url: `${apiURL}/orders/myorders`,
    method: 'get'
  },
  getOrderPaymentmethods: (id: string) => {
    return {
      url: `${apiURL}/orders/paymentmethods/${id}`,
      method: 'get'
    };
  },
  // Questionnaire
  updateQuestionnaire: {
    url: `${apiURL}/questionnaire`,
    method: 'post'
  },
  getQuestionnaire: {
    url: `${apiURL}/questionnaire`,
    method: 'get'
  },
  // Products
  getProductsForCheckOut: {
    url: `${apiURL}/products`,
    method: 'get'
  },
  getProducts: (type: any) => {
    return {
      url: `${apiURL}/products/${type}`,
      method: 'get'
    }
  },
  // Kanban
  getKanban: {
    url: `${apiURL}/kanban`,
    method: 'get'
  },
  reArrangeKanban: {
    url: `${apiURL}/kanban/reArrangeKanban`,
    method: 'post'
  },
  // Task
  createTask: {
    url: `${apiURL}/task`,
    method: 'post'
  },
  getTaskHelperData: {
    url: `${apiURL}/task/helper/data`,
    method: 'get'
  },
  getTask: (id: string) => {
    return {
      url: `${apiURL}/task/${id}`,
      method: 'get'
    };
  },
  updateTask: (id: string) => {
    return {
      url: `${apiURL}/task/${id}`,
      method: 'put'
    };
  },
  getCallTasks: {
    url: `${apiURL}/task/client/calls`,
    method: 'get'
  },
  // Programs
  createProgram: {
    url: `${apiURL}/programs`,
    method: 'post'
  },
  getProgramsListing: {
    url: `${apiURL}/programs/listing`,
    method: 'post'
  },
  getPrograms: {
    url: `${apiURL}/programs`,
    method: 'get'
  },
  getProgram: (id: string) => {
    return {
      url: `${apiURL}/programs/${id}`,
      method: 'get'
    };
  },
  updateProgram: (id: string) => {
    return {
      url: `${apiURL}/programs/${id}`,
      method: 'put'
    };
  },
  // Users
  getUsersListing: {
    url: `${apiURL}/user/listing`,
    method: 'post'
  },
  createUser: {
    url: `${apiURL}/user`,
    method: 'post'
  },
  getUser: (id: string) => {
    return {
      url: `${apiURL}/user/${id}`,
      method: 'get'
    };
  },
  updateUser: (id: string) => {
    return {
      url: `${apiURL}/user/${id}`,
      method: 'put'
    };
  },
  // Clients
  getClientsListing: {
    url: `${apiURL}/clients/listing`,
    method: 'post'
  },
  getClientDetails: (id: string) => {
    return {
      url: `${apiURL}/clients/details/${id}`,
      method: 'get'
    }
  },
  getOnboardingCallStatus: {
    url: `${apiURL}/clients/onboarding/call/status`,
    method: 'get'
  },
  // Chat
  sendMessage: {
    url: `${apiURL}/chats/message`,
    method: 'post'
  },
  getChat: (clientId: any) => {
    return {
      url: `${apiURL}/chats/${clientId}`,
      method: 'get'
    }
  },
  // Notes
  getClientNotes: (id: string) => {
    return {
      url: `${apiURL}/notes/client/${id}`,
      method: 'get'
    };
  },
  createNotes: {
    url: `${apiURL}/notes`,
    method: 'post'
  },
  updateNote: (id: string) => {
    return {
      url: `${apiURL}/notes/${id}`,
      method: 'put'
    };
  },
  // Logs
  getLogs: (id: string) => {
    return {
      url: `${apiURL}/logs/${id}`,
      method: 'get'
    };
  },
  getStudioAgreement: (orderid: string) => {
    return {
      url: `${apiURL}/helper/studioagrement/${orderid}`,
      method: 'get'
    };
  },
  // Booking
  getMyClasses: {
    url: `${apiURL}/booking/myliveclasses`,
    method: 'get'
  },
  bookClass: {
    url: `${apiURL}/booking/liveClass`,
    method: 'post'
  },
  updateBookClass: (id: string) => {
    return {
      url: `${apiURL}/booking/liveClass/${id}`,
      method: 'put'
    }
  },
  // File Upload
  fileUpload: {
    url: `${apiURL}/assets`,
    method: 'post'
  },
  getIPRegistry: {
    url: `https://api.ipregistry.co/?key=5nii95bre3drjfb1`,
    method: 'get'
  }
};
