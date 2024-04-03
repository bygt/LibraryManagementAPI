import { User } from "./../models/User";

import express, { Request, Response } from "express";
import Joi, { ValidationResult } from "joi";
const router = express.Router();
import { Ownership } from "../models/Ownership";
import { Book } from "../models/Book";
import { Rating } from "../models/Rating";
import catchAsync from "../helpers/catchAsync";


//get all users
router.get("/users",  catchAsync (async (req: Request, res: Response, next) => {

    const body = await User.findAll();

    if (!body) throw new Error("User not found !");    

    return res.status(200).send({ error: false, body });
  
}));

// get one user
router.get("/users/:user_id",catchAsync( async (req: Request, res: Response, next) => {
  const schema = Joi.object({
    user_id: Joi.number().integer().min(1).required(),
  });
  const { user_id } = req.params;
  const { error } = schema.validate(req.params);

  if (error) return res.status(400).send({ error: error.details[0].message });
 
    //find user
    const user = await  User.findOne({where :{ user_id}});

    if (!user) throw new Error("User not found !");

    //find books borrowed by user

    const borrowed_books = await Ownership.findAll({
      where: {
        user_id,
      },
      include: [
        {
          model: Book,
          association: Ownership.hasOne(Book, {
            foreignKey: "book_id",
            sourceKey: "book_id",
          }),
        },
      ],
    });

    const ratings_list = await Rating.findAll({
        where: {
            user_id,
        },
        });

    // get user scores per book
    const borrowed = borrowed_books.map((book) => {
      const rating = ratings_list.find(
        (rating: Rating) => rating.book_id == book.book_id
      );

      if (rating) {
        book.dataValues.Book.dataValues.userScore = rating.dataValues.score;
      }
      return book;
    });

    const past: Ownership[] = [];
    const present: Ownership[] = [];

    borrowed.map((book) => {
      // delete properties
      delete book.dataValues.user_id;
      delete book.dataValues.book_id;
      delete book.dataValues.ownership_id;
      delete book.dataValues.Book.dataValues.current_owner_id;
      delete book.dataValues.Book.dataValues.book_id;
      delete book.dataValues.Book.dataValues.avg_rating;
      delete book.dataValues.Book.dataValues.is_available;

      if (book.dataValues.status == 0) {
        delete book.dataValues.status;
        past.push(book);
      } else {
        delete book.dataValues.status;
        present.push(book);
      }
      return book;
    });

    const body = {
      id: user_id,
      name: user.username,
      books: { past, present },
    };

    return res.status(200).send({ error: false, body });
 
}));

//create user
router.post("/users",catchAsync( async (req: Request, res: Response) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
  });
  const { username } = req.body;
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });


    const user = await User.create({
      username,
    });
    if (!user) throw new Error("Error while creating user, try again");

    return res.status(200).send({ error: false, user });
  
}));

module.exports = router;
