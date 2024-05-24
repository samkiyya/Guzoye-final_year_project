import Tour from "../models/tour";
import Review from "../models/review";
import { Request, Response } from "express";

export const createReview = async (req: Request, res: Response) => {
  if (req.userId !== req.body.userRef) {
    return res.status(401).send({
      success: false,
      message: "You can only give rating on your own account!",
    });
  }
  const tourId = req.params.tourId;

  const newReview = await Review.create(req.body);

  try {
    const newReview = await Review.create(req.body);
    if (newReview) {
      const ratings = await Review.find({ packageId: tourId });
      let totalRatings = await ratings.length;
      let totalStars = 0;
      await ratings.map((rating) => {
        totalStars += rating.rating;
      });
      let average_rating =
        (await Math.round((totalStars / totalRatings) * 10)) / 10;
      // console.log("total ratings: " + totalRatings);
      // console.log("total stars: " + totalStars);
      // console.log("average: " + average_rating);
      // after creating a new review now update the reviews array of the tour
      const setPackageRatings = await Tour.findByIdAndUpdate(
        tourId,
        {
          $set: {
            packageRating: average_rating,
            packageTotalRatings: totalRatings,
          },
        },
        { new: true }
      );
      // console.log(setPackageRatings);
      if (setPackageRatings) {
        return res.status(201).send({
          success: true,
          message: "Thanks for your feedback!",
        });
      } else {
        return res.status(500).send({
          success: false,
          message: "Soemthing went wrong while rating to package!",
        });
      }
    } else {
      return res.status(500).send({
        success: false,
        message: "Soemthing went wrong",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const ratingGiven = async (req: Request, res: Response) => {
  try {
    const rating_given = await Review.findOne({
      userRef: req?.params?.userId,
      packageId: req?.params?.packageId,
    });
    if (rating_given) {
      return res.status(200).send({
        given: true,
      });
    } else {
      return res.status(200).send({
        given: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const averageRating = async (req: Request, res: Response) => {
  try {
    const ratings = await Review.find({ packageId: req?.params?.id });
    let totalStars = 0;
    await ratings.map((rating) => {
      totalStars += rating.rating;
    });
    let average = Math.round((totalStars / ratings.length) * 10) / 10;
    if (ratings.length) {
      res.status(200).send({
        rating: average,
        totalRatings: ratings.length,
      });
    } else {
      res.status(200).send({
        rating: 0,
        totalRatings: 0,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAllRatings = async (req: Request, res: Response) => {
  try {
    const ratings = await Review.find({
      packageId: req?.params?.id,
    });
    if (ratings) {
      return res.send(ratings);
    } else {
      return res.send("N/A");
    }
  } catch (error) {
    console.log(error);
  }
};
