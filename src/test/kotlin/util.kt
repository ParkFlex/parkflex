import parkflex.repository.JwtRepository

fun dummyToken(uid: Long) =
    JwtRepository.generateToken(uid, "dummy@parkflex.pl", "user")

