import { useDispatch } from "react-redux";
import { showSnackbar } from "../Redux/snackbarslice";
import { useEffect, useState } from "react";

export const useAsnycMuatation = (mutationHook) => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);
    const dispatch = useDispatch();
    const [mutate] = mutationHook(); // Ensure this returns an array
    const execute = async (toastMessage, ...args) => {
        console.log(args);

        setIsLoading(true);
        dispatch(showSnackbar({
            message: "Loading",
            severity: "success"
        }))

        try {
            const res = await mutate(...args);
            console.log(res);
            if (res.data) {
                dispatch(showSnackbar({
                    message: res?.data?.message || "Success",
                    severity: "success"
                }))
                //   toast.success(res?.data?.message || "Success", { id: toastId });
                setData(res.data);
            } else {
                // toast.error(res?.error?.data?.error?.message || "Something went wrong", { id: toastId });
                dispatch(showSnackbar({
                    message: res?.error?.data?.error?.message || "Something went wrong",
                    severity: "error"
                }))
                // res?.data?.message || "Success"
                console.log(res?.error?.data?.error?.message);
            }
        } catch (error) {
            console.log(error);
            dispatch(showSnackbar({
                message: "Something went wrong",
                severity: "error"
            }))
        } finally {
            setIsLoading(false);
        }
    };

    return [execute, isLoading, data];
};

export const useSocketEvents = (socket, handlers) => {
    useEffect(() => {
        Object.entries(handlers).forEach(([event, handler]) => {
            socket.on(event, handler)
        })

        return () => {
            Object.entries(handlers).forEach(([event, handler]) => {
                socket.off(event, handler)
            })

        }
    }, [socket, handlers])

}