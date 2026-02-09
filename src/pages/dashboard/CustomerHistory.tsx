import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, Package, ArrowRight, Star, MessageSquare, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const historyOrders = [
  {
    id: "ORD-002",
    item: "Oleh-oleh Jogja",
    from: "Yogyakarta",
    to: "Jakarta",
    status: "completed" as const,
    traveler: "Sari Dewi",
    travelerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sari",
    travelerPhone: "0814-xxxx-5678",
    date: "10 Feb 2024",
    price: "Rp 50.000",
    rating: 0,
    hasRated: false,
  },
  {
    id: "ORD-003",
    item: "Sepatu Adidas",
    from: "Surabaya",
    to: "Jakarta",
    status: "completed" as const,
    traveler: "Budi Santoso",
    travelerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=budi",
    travelerPhone: "0815-xxxx-9012",
    date: "5 Feb 2024",
    price: "Rp 65.000",
    rating: 4,
    hasRated: true,
  },
  {
    id: "ORD-004",
    item: "Elektronik",
    from: "Bandung",
    to: "Jakarta",
    status: "cancelled" as const,
    traveler: "-",
    travelerAvatar: "",
    travelerPhone: "",
    date: "1 Feb 2024",
    price: "Rp 0",
    rating: 0,
    hasRated: false,
  },
];

export default function CustomerHistory() {
  const { toast } = useToast();
  const [chatDialog, setChatDialog] = useState<{ open: boolean; traveler: any; orderId: string }>({
    open: false,
    traveler: null,
    orderId: ""
  });
  const [message, setMessage] = useState("");

  const handleChatTraveler = (order: typeof historyOrders[0]) => {
    if (order.traveler !== "-" && order.travelerAvatar) {
      setChatDialog({
        open: true,
        traveler: {
          name: order.traveler,
          avatar: order.travelerAvatar,
          phone: order.travelerPhone
        },
        orderId: order.id
      });
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      toast({
        title: "Pesan Terkirim",
        description: `Pesan kepada ${chatDialog.traveler?.name} telah terkirim.`,
      });
      setMessage("");
      setChatDialog({ open: false, traveler: null, orderId: "" });
    }
  };

  return (
    <DashboardLayout role="customer">
      <div className="p-6 md:p-8 lg:p-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Riwayat Order</h1>
          <p className="text-muted-foreground mt-1">Lihat semua order yang sudah selesai</p>
        </motion.div>

        {historyOrders.length > 0 ? (
          <div className="space-y-4">
            {historyOrders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl bg-card p-5 shadow-card"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-muted-foreground">{order.id}</span>
                      <StatusBadge status={order.status} size="sm" />
                    </div>
                    <p className="font-semibold text-foreground text-lg">{order.item}</p>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <span>{order.from}</span>
                      <ArrowRight className="h-3 w-3" />
                      <span>{order.to}</span>
                    </div>
                    {order.traveler !== "-" && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Traveler: <span className="font-medium text-foreground">{order.traveler}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="text-left md:text-right">
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                      <p className="font-semibold text-primary">{order.price}</p>
                      {order.hasRated && order.rating > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: order.rating }).map((_, j) => (
                            <Star key={j} className="h-3 w-3 fill-warning text-warning" />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/order/${order.id}`}>Detail</Link>
                      </Button>
                      {order.status === "completed" && order.traveler !== "-" && (
                        <Button 
                          variant="soft" 
                          size="sm" 
                          onClick={() => handleChatTraveler(order)}
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Chat Traveler
                        </Button>
                      )}
                      {order.status === "completed" && !order.hasRated && (
                        <Button variant="default" size="sm" asChild>
                          <Link to={`/order/${order.id}`}>
                            <Star className="h-3 w-3 mr-1" />
                            Beri Rating
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Clock}
            title="Belum ada riwayat"
            description="Order yang sudah selesai akan muncul di sini"
          />
        )}
      </div>

      {/* Chat Traveler Dialog */}
      <Dialog open={chatDialog.open} onOpenChange={() => setChatDialog({ open: false, traveler: null, orderId: "" })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chat dengan Traveler</DialogTitle>
            <DialogDescription>
              Kirim pesan kepada {chatDialog.traveler?.name} terkait order {chatDialog.orderId}
            </DialogDescription>
          </DialogHeader>
          
          {chatDialog.traveler && (
            <div className="space-y-4">
              {/* Traveler Info */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <img
                  src={chatDialog.traveler.avatar}
                  alt={chatDialog.traveler.name}
                  className="h-12 w-12 rounded-full bg-muted"
                />
                <div>
                  <p className="font-semibold text-foreground">{chatDialog.traveler.name}</p>
                  <p className="text-sm text-muted-foreground">{chatDialog.traveler.phone}</p>
                </div>
              </div>

              {/* Message Input */}
              <Textarea
                placeholder="Tulis pesan Anda di sini... Contoh: Terima kasih atas pengirimannya!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />

              <Button className="w-full" onClick={sendMessage} disabled={!message.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Kirim Pesan
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Pesan akan dikirim melalui sistem NitipGo
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
