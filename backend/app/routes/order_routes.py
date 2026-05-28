from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.user import User
from ..models.order import Order
from ..schemas.order_schema import OrderCreate, OrderResponse
from ..auth.dependencies import get_current_user

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("/", response_model=OrderResponse)
def create_order(order: OrderCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_order = Order(
        user_id=current_user.id,
        restaurant=order.restaurant,
        meal_name=order.meal_name,
        amount=order.amount,
        calories=order.calories,
        protein=order.protein,
        carbs=order.carbs,
        fat=order.fat
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order

@router.get("/", response_model=List[OrderResponse])
def get_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    orders = db.query(Order).filter(Order.user_id == current_user.id).all()
    return orders

@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    db.delete(order)
    db.commit()
    return {"message": "Order deleted"}

@router.delete("/")
def clear_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db.query(Order).filter(Order.user_id == current_user.id).delete()
    db.commit()
    return {"message": "All orders cleared"}
