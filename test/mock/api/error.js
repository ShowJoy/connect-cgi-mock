var err = new Error('error message');
err.code = 123;
err.statusCode = 608;

next(err);