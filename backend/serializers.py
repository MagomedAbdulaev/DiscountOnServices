from .models import *
from typing import Iterable, List, Dict, Any


def serialize_services(services: Iterable[Services], language) -> List[Dict[str, Any]]:

    data = []
    for service in services:
        data.append({
            "id": service.id,
            "name": getattr(service, f"name_{language}", service.name),  # Selecting field based on current language
            "description": getattr(service, f"description_{language}", service.description),
            "slug": service.slug,
            'image': service.image.url.replace('frontend/public/', ''),
        })

    return data


def serialize_service_detail(service, language) -> List[Dict[str, Any]]:

    data = {
        "id": service.id,
        "name": getattr(service, f"name_{language}", service.name),  # Выбор поля на основе текущего языка
        "description": getattr(service, f"description_{language}", service.description),
        "slug": service.slug,
        "image": service.image.url.replace("frontend/public/", ""),
        "plans": [
            {
                "id": plan.id,
                "price": plan.price,
                "name": getattr(plan, f"name_{language}", plan.name),
                "duration": plan.duration.duration,
                "clauses": [
                    {
                        "id": clause.id,
                        "name": getattr(clause, f"name_{language}", clause.name),
                    }
                    for clause in plan.clauses.all()
                ],
            }
            for plan in service.plans.all()  # Теперь используем related_name `plans` из модели Plan
        ],
        "durations": sorted(list(
            set(plan.duration.duration for plan in service.plans.all())
        )),  # Уникальные длительности
    }
    return data


def serialize_questions(questions: Iterable[Questions], language) -> List[Dict[str, Any]]:

    data = []
    for question in questions:
        data.append({
            "id": question.id,
            "name": getattr(question, f"name_{language}", question.name),  # Selecting field based on current language
            "answer": getattr(question, f"answer_{language}", question.answer),
        })

    return data


def serialize_info_user(user, language) -> Dict[str, Any]:

    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'subscriptions': [{
            'id': subscription.plan.id,
            'plan_name': getattr(subscription.plan.service, f"name_{language}", subscription.plan.service.name),
            'service_name': getattr(subscription.plan, f"name_{language}", subscription.plan.name),
            'description': getattr(subscription.plan.service, f"description_{language}",
                                   subscription.plan.service.description),
            'color': subscription.plan.service.color,
        } for subscription in user.subscriptions.all()]
    }
