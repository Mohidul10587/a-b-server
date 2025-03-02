"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useData = exports.DataProvider = void 0;
const react_1 = __importStar(require("react"));
const urls_1 = require("./shared/urls");
const swr_1 = __importDefault(require("swr"));
const fetcher_1 = require("./shared/fetcher");
const DataContext = (0, react_1.createContext)(undefined);
const DataProvider = ({ children, session, }) => {
    const [numberOfCartProduct, setNumberOfCartProducts] = (0, react_1.useState)(0);
    const [thisProductQuantity, setThisProductQuantity] = (0, react_1.useState)(0);
    const [user, setUser] = (0, react_1.useState)({
        _id: "",
        slug: "",
        email: "",
        name: "",
        image: "",
        isSeller: false,
        isUser: true,
        createdAt: "",
        sellerId: {},
        coins: 0,
        coinsTakingDate: "",
        isOneClickPayOffer: false,
        oneClickPayStartedAt: "",
    });
    const [sessionStatus, setSessionStatus] = (0, react_1.useState)("loading");
    (0, react_1.useEffect)(() => {
        var _a, _b, _c;
        if (session) {
            setSessionStatus("authenticated");
            const storeUserDataInDatabase = (userData) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const response = yield fetch(`${urls_1.apiUrl}/user/create`, {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(userData),
                    });
                    if (!response.ok) {
                        throw new Error("Failed to store user data in the database.");
                    }
                    if (response.ok) {
                        const data = yield response.json();
                        localStorage.setItem("myId", data.user._id);
                        setUser(data.user);
                        if (localStorage.getItem("isCartSaved") !== "cart saved") {
                            const cartData = localStorage.getItem("cartData");
                            if (!cartData)
                                return;
                            try {
                                const response = yield fetch(`${urls_1.apiUrl}/cart/create`, {
                                    method: "POST",
                                    credentials: "include",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        userId: data.user._id,
                                        cartItems: JSON.parse(cartData),
                                    }),
                                });
                                if (response.ok) {
                                    const result = yield response.json();
                                    localStorage.setItem("isCartSaved", "cart saved");
                                    localStorage.removeItem("cartData");
                                    const total = result.cart.cartItems.reduce((total, item) => total + item.quantity, 0);
                                    setNumberOfCartProducts(total);
                                }
                            }
                            catch (error) {
                                console.error("Error saving cart:", error);
                            }
                        }
                    }
                }
                catch (error) {
                    console.error("Error storing user data:", error);
                }
            });
            const userData = {
                name: ((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.name) || "Unknown User",
                email: ((_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.email) || "",
                image: ((_c = session === null || session === void 0 ? void 0 : session.user) === null || _c === void 0 ? void 0 : _c.image) || "",
            };
            storeUserDataInDatabase(userData);
        }
        else {
            setSessionStatus("unauthenticated");
        }
    }, [session]);
    const { data: response, error, mutate, isLoading, } = (0, swr_1.default)(`additionalSettings`, fetcher_1.fetcher);
    const additionalSettings = response === null || response === void 0 ? void 0 : response.respondedData;
    return (<DataContext.Provider value={{
            user,
            session,
            sessionStatus,
            additionalSettings,
            numberOfCartProduct,
            setNumberOfCartProducts,
            thisProductQuantity,
            setThisProductQuantity,
        }}>
      {children}
    </DataContext.Provider>);
};
exports.DataProvider = DataProvider;
const useData = () => {
    const context = (0, react_1.useContext)(DataContext);
    if (!context) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
};
exports.useData = useData;
// change
