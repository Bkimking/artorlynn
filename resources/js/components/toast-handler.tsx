import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';

export default function ToastHandler() {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.toast) {
            const { type, message, title } = flash.toast;
            
            const toastFn = toast[type as keyof typeof toast] || toast.info;
            
            // @ts-ignore
            toastFn(message, {
                description: title,
            });
        }
    }, [flash?.toast]);

    return null;
}
