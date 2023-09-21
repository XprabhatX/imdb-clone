import { Router } from "express";
import movie from "../models/Movie.js";

const router = Router();

router.get("/movies", async(req,res) => {
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || "";
        let sort = req.query.sort || "rating";
        let genre = req.query.genre || "All";

        const genreOptions = [
            "Action",
            "Romance",
            "Fantasy",
            "Drama",
            "Crime",
            "Adventure",
            "Thriller",
            "Sci-fi",
            "Music",
            "Family",
        ];

        // if genre is set to all then we will search for all genre[1] otherwise the selected one[2]
        genre === "All"
            ? (genre = [...genreOptions]) // [1]
            : (genre = req.query.genre.split(",")); // [2]

        // if a sorting field is given then sort by given field otherwise sort is set to previous sort
        req.query.sort? (sort = req.query.sort.split(",")) : (sort = [sort])

        let sortBy = {}; // indicates ascending or descending
        if(sort[1]) {
            sortBy[sort[0]] = sort[1];
        } else {
            sortBy[sort[0]] = "asc";
        }

        // Searching in movies collection with different parameters
        const movies = await movie.find({ name: { $regex: search, $options: "i" } })
			.where("genre")
			.in([...genre])
			.sort(sortBy)
			.skip(page * limit)
			.limit(limit);

        const total = await movie.countDocuments({
            genre: { $in:[...genre] }, // include given genres
            name: {$regex: search, $options: "i"}, // searching with text
        });

        const response = {
            error: false,
            total,
            page: page + 1,
            limit,
            genres: genreOptions,
            movies,
        }

        res.status(200).json(response);

    } catch(err) {
        console.log(err);
        res.status(500).json({error: true, message: "Internal Server Error"});
    }
});

export default router;