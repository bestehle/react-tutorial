// import React from 'react'

var data = [
  {
    id: 1,
    author: "Pete Hunt",
    text: "This is one comment"
  }, {
    id: 2,
    author: "Jordan Walke",
    text: "This is *another* comment"
  }
];

var CommentBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: data => {
        this.setState({data: data});
      },
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className='commentBox'>
        <h1>Commments</h1>
        <CommentForm/>
        <CommentList data={this.state.data}/>
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    console.log(this.props);
    var commentNodes = this.props.data.map(comment => {
      return (
        <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>
      )
    })
    return (
      <div className='commentList'>
        {commentNodes}
      </div>
    )
  }
});

var CommentForm = React.createClass({
  getInitialState: function() {
    return {author: '', text: ''};
  },
  handleAuthorChange: function(e) {
    this.setState({author: e.target.Value});
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.Value});
  },
  render: function() {
    return (
      <form className='commentForm'>
        <input type='text' placeholder='Your name' value={this.state.author} onChange='handleAuthorChange'/>
        <input type='text' placeholder='Say something...' value={this.state.text} onChange='handleTextChange'/>
        <input type='submit' value='Post'/>
      </form>
    );
  }
});

var Comment = React.createClass({
  rawMarkup: function() {
    var md = new Remarkable();
    var rawMarkup = md.render(this.props.children.toString());
    return {__html: rawMarkup};
  },

  render: function() {
    return (
      <div className='comment'>
        <h2 className='commentAuthor'>
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()}/>
      </div>
    )
  }
})

ReactDOM.render(
  <CommentBox data={data} pollInterval={2000} url='/api/comments'/>, document.getElementById('content'));
