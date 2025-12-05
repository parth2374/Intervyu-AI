import { PayPalButtons } from '@paypal/react-paypal-js'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useAuthContext } from '@/app/provider'
import { supabase } from '@/services/supabaseClient'

const PayButton = ({ amount, credits }) => {

  const { user } = useAuthContext()

  const onPaymentSuccess = async () => {
    const { data, error } = await supabase
      .from('Users')
      .update({ credits: Number(user?.credits) + credits })
      .eq('email', user?.email)
      .select()
      
    toast('Credits Updated!')
    window.location.reload()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={`w-full`}>Purchase Credits</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription asChild>
            <PayPalButtons
              style={{ layout: "vertical" }}
              onApprove={() => onPaymentSuccess()}
              onCancel={() => toast.error('Payment Cancelled!')}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: amount,
                        currency_code: 'USD'
                      }
                    }
                  ]
                })
              }}
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default PayButton