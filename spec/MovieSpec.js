describe("add",function(){
  var movie;
  var title = "title"
  var releaseDate = 1234
  var trailer = "trailer"

  beforeEach(function(){
    movie = new MovieToAdd(title,releaseDate,trailer)
  });

    it("increases the users movie list",function(){
      expect(user.movie.list.length)toBe(1)
    })
    it("contains a title",function(){
      expect(movie.title).toBe(title)
    })
    it("contains a release date",function(){
      expect(movie.releaseDate).toBe(releaseDate)
    })
    it("contains a trailer",function(){
      expect(movie.trailer).toBe(trailer)
    })

})

