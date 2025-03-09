import React from 'react';
import {ReviewResponse} from "@/types/responses.ts";
import {Star} from 'lucide-react'
import {format} from "date-fns"
import {Avatar, AvatarFallback} from "@/components/ui/avatar"
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card"

type ReviewCardProps = {
    review: ReviewResponse
}

function getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-5 h-5 ${
                        star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                />
            ))}
        </div>
    )
}

function ReviewCard(props: ReviewCardProps) {
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="flex flex-col space-y-4">
                <StarRating rating={props.review.rating} />
                <div className="flex items-center space-x-4">
                    <Avatar>
                        <AvatarFallback>{getInitials(props.review.firstName, props.review.lastName)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{`${props.review.firstName} ${props.review.lastName}`}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {props.review.comment && <p className="text-gray-600">{props.review.comment}</p>}
            </CardContent>
            <CardFooter>
                <p className="text-sm text-gray-500">
                    Posted on {format(props.review.createdDate, "MMMM d, yyyy")}
                </p>
            </CardFooter>
        </Card>
    );
}

export default ReviewCard;